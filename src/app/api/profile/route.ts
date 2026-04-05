// app/api/profile/route.ts - 用户资料接口

import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getServerSession } from 'next-auth';
import {
  getOrCreateUser,
  getEffectivePlan,
  getUserUsageToday,
  getUserUsageThisMonth,
} from '@/lib/db';
import { LIMITS, MONTHLY_LIMITS } from '@/lib/usage';

const ADMIN_EMAIL = 'wanglilong616@gmail.com';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const db = env.DB;

  const user = await getOrCreateUser(db, {
    id: session.user.email,
    email: session.user.email,
    name: session.user.name ?? undefined,
    avatar: session.user.image ?? undefined,
  });

  const isAdmin = session.user.email === ADMIN_EMAIL;
  const effectivePlan = isAdmin ? 'pro' : getEffectivePlan(user);

  const usedToday = await getUserUsageToday(db, user.id);
  const usedThisMonth = await getUserUsageThisMonth(db, user.id);

  const dailyLimit = effectivePlan === 'pro' ? LIMITS.pro : LIMITS.free;
  const monthlyLimit = effectivePlan === 'pro' ? MONTHLY_LIMITS.pro : null;

  return NextResponse.json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    plan: effectivePlan,
    proExpiresAt: user.pro_expires_at,
    usedToday,
    dailyLimit,
    usedThisMonth,
    monthlyLimit,
  });
}
