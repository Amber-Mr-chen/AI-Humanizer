// app/api/humanize/route.ts - 核心Humanize API

import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getHumanizePrompt, HumanizeMode } from '@/lib/prompts';
import {
  getOrCreateUser,
  getEffectivePlan,
  getUserUsageToday,
  getUserUsageThisMonth,
  getIpUsageToday,
  addUsage,
  saveHistory,
} from '@/lib/db';
import { canHumanize, canHumanizeMonthly, LIMITS, MONTHLY_LIMITS } from '@/lib/usage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const ADMIN_EMAIL = 'wanglilong616@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    const db = env.DB as D1Database;
    const apiKey = (env as any).SILICONFLOW_API_KEY as string | undefined;

    if (!apiKey) {
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    const body = await req.json();
    const { text, mode = 'standard' } = body as { text: string; mode?: HumanizeMode };

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
    }

    const validModes: HumanizeMode[] = ['standard', 'academic', 'creative'];
    if (!validModes.includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    const charCount = trimmed.length;

    // 获取用户会话
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const isAdmin = userEmail === ADMIN_EMAIL;

    let plan: 'guest' | 'free' | 'pro' = 'guest';
    let userId: string | null = null;
    let usedToday = 0;

    if (userEmail && db) {
      // 登录用户
      const user = await getOrCreateUser(db, {
        id: (session!.user as any).id ?? userEmail,
        email: userEmail,
        name: session?.user?.name ?? undefined,
        avatar: session?.user?.image ?? undefined,
      });
      userId = user.id;
      const effectivePlan = isAdmin ? 'pro' : getEffectivePlan(user);
      plan = effectivePlan;
      usedToday = await getUserUsageToday(db, userId);
    } else {
      // 游客：按IP限流
      const ip =
        req.headers.get('CF-Connecting-IP') ||
        req.headers.get('X-Forwarded-For')?.split(',')[0] ||
        'unknown';

      if (db && ip !== 'unknown') {
        usedToday = await getIpUsageToday(db, ip);
      }

      // 检查游客额度
      if (!canHumanize('guest', usedToday, charCount)) {
        return NextResponse.json(
          {
            error: 'daily_limit_exceeded',
            message: 'Daily limit reached. Sign in for more characters.',
            limit: LIMITS.guest,
            used: usedToday,
          },
          { status: 429 }
        );
      }

      // 调用AI
      const prompt = getHumanizePrompt(mode, trimmed);
      const result = await callAI(prompt, apiKey);

      // 记录用量
      if (db && ip !== 'unknown') {
        await addUsage(db, { ip, charCount });
      }

      return NextResponse.json({ result, charCount });
    }

    // Admin跳过所有限制
    if (!isAdmin) {
      // 每日额度检查（免费用户）
      if (plan === 'free' && !canHumanize('free', usedToday, charCount)) {
        return NextResponse.json(
          {
            error: 'daily_limit_exceeded',
            message: 'Daily limit reached. Upgrade to Pro for unlimited access.',
            limit: LIMITS.free,
            used: usedToday,
          },
          { status: 429 }
        );
      }

      // Pro月度额度检查
      if (plan === 'pro' && db && userId) {
        const usedThisMonth = await getUserUsageThisMonth(db, userId);
        if (!canHumanizeMonthly(usedThisMonth, charCount)) {
          return NextResponse.json(
            {
              error: 'monthly_limit_exceeded',
              message: `Monthly limit of ${(MONTHLY_LIMITS.pro / 1000).toFixed(0)}k characters reached. Resets on the 1st of next month.`,
              limit: MONTHLY_LIMITS.pro,
              used: usedThisMonth,
            },
            { status: 429 }
          );
        }
      }
    }

    // 调用AI
    const prompt = getHumanizePrompt(mode, trimmed);
    const result = await callAI(prompt, apiKey);

    // 记录用量和历史
    if (db && userId) {
      await addUsage(db, { userId, charCount });
      await saveHistory(db, {
        userId,
        mode,
        inputText: trimmed,
        outputText: result,
        charCount,
      });
    }

    return NextResponse.json({ result, charCount });
  } catch (error) {
    console.error('Humanize API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function callAI(prompt: string, apiKey: string | undefined): Promise<string> {
  if (!apiKey) {
    return `[Demo] This is a humanized version of your text. Configure SILICONFLOW_API_KEY to enable real AI processing.`;
  }

  const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('SiliconFlow API error:', response.status, err);
    throw new Error(`SiliconFlow API error: ${response.status}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
