// lib/usage.ts - 用量限制逻辑

export const LIMITS = {
  guest: 300,    // 游客（按IP），300字符/天
  free: 1000,   // 免费用户，1000字符/天
  pro: Infinity, // Pro用户，日无限
} as const;

export const MONTHLY_LIMITS = {
  pro: 200000,  // Pro用户每月200,000字符（约100,000词）
} as const;

export type UserPlan = 'guest' | 'free' | 'pro';

export function getDailyLimit(plan: UserPlan): number {
  return LIMITS[plan];
}

export function getRemainingChars(plan: UserPlan, usedToday: number): number {
  const limit = getDailyLimit(plan);
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - usedToday);
}

export function canHumanize(plan: UserPlan, usedToday: number, inputChars: number): boolean {
  if (plan === 'pro') return true;
  const remaining = getRemainingChars(plan, usedToday);
  return inputChars <= remaining;
}

export function canHumanizeMonthly(usedThisMonth: number, inputChars: number): boolean {
  return usedThisMonth + inputChars <= MONTHLY_LIMITS.pro;
}
