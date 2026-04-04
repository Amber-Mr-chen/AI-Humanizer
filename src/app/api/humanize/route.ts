// app/api/humanize/route.ts - 核心Humanize API

import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getHumanizePrompt, HumanizeMode } from '@/lib/prompts';
import {
  getOrCreateUser,
  getEffectivePlan,
  getUserUsageToday,
  getIpUsageToday,
  addUsage,
  saveHistory,
} from '@/lib/db';
import { canHumanize, LIMITS } from '@/lib/usage';
import { auth } from '@/lib/auth';

const ADMIN_EMAIL = 'wanglilong616@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    const db = env.DB as D1Database;
    const ai = (env as any).AI;

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
    const session = await auth();
    const userEmail = session?.user?.email;
    const isAdmin = userEmail === ADMIN_EMAIL;

    let plan: 'guest' | 'free' | 'pro' = 'guest';
    let userId: string | null = null;
    let usedToday = 0;

    if (userEmail && db) {
      // 登录用户
      const user = await getOrCreateUser(db, {
        id: session!.user!.id ?? userEmail,
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
      const result = await callAI(ai, prompt);

      // 记录用量
      if (db && ip !== 'unknown') {
        await addUsage(db, { ip, charCount });
      }

      return NextResponse.json({ result, charCount });
    }

    // 登录用户额度检查
    if (!isAdmin && !canHumanize(plan as 'free' | 'pro', usedToday, charCount)) {
      const limit = plan === 'free' ? LIMITS.free : LIMITS.guest;
      return NextResponse.json(
        {
          error: 'daily_limit_exceeded',
          message: plan === 'free'
            ? 'Daily limit reached. Upgrade to Pro for unlimited access.'
            : 'Daily limit reached. Sign in for more characters.',
          limit,
          used: usedToday,
        },
        { status: 429 }
      );
    }

    // 调用AI
    const prompt = getHumanizePrompt(mode, trimmed);
    const result = await callAI(ai, prompt);

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

async function callAI(ai: any, prompt: string): Promise<string> {
  if (!ai) {
    // 开发环境fallback（没有Cloudflare AI时）
    return `[Demo] This is a humanized version of your text. Deploy to Cloudflare to enable real AI processing.`;
  }

  const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048,
  });

  return response?.response?.trim() ?? '';
}
