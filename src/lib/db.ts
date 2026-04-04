// lib/db.ts - D1 数据库操作封装

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  plan: 'free' | 'pro';
  pro_expires_at: number | null;
  trial_used: number;
  created_at: number;
}

export interface UsageRecord {
  id: number;
  user_id: string | null;
  ip: string | null;
  date: string;
  char_count: number;
}

export interface HistoryRecord {
  id: number;
  user_id: string;
  mode: string;
  input_text: string;
  output_text: string;
  char_count: number | null;
  created_at: number;
}

// 获取或创建用户
export async function getOrCreateUser(
  db: D1Database,
  data: { id: string; email: string; name?: string; avatar?: string }
): Promise<User> {
  const existing = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(data.email)
    .first<User>();

  if (existing) return existing;

  // 新用户：给3天Pro试用
  const trialExpires = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;

  await db
    .prepare(
      'INSERT INTO users (id, email, name, avatar, plan, pro_expires_at, trial_used) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .bind(data.id, data.email, data.name ?? null, data.avatar ?? null, 'pro', trialExpires, 1)
    .run();

  return (await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(data.email)
    .first<User>())!;
}

// 获取用户当前有效计划
export function getEffectivePlan(user: User): 'free' | 'pro' {
  if (user.plan === 'pro' && user.pro_expires_at) {
    const now = Math.floor(Date.now() / 1000);
    if (now < user.pro_expires_at) return 'pro';
  }
  return 'free';
}

// 获取今日已用字符数（登录用户）
export async function getUserUsageToday(db: D1Database, userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const record = await db
    .prepare('SELECT char_count FROM usage WHERE user_id = ? AND date = ?')
    .bind(userId, today)
    .first<{ char_count: number }>();
  return record?.char_count ?? 0;
}

// 获取今日已用字符数（游客IP）
export async function getIpUsageToday(db: D1Database, ip: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const record = await db
    .prepare('SELECT char_count FROM usage WHERE ip = ? AND user_id IS NULL AND date = ?')
    .bind(ip, today)
    .first<{ char_count: number }>();
  return record?.char_count ?? 0;
}

// 增加用量记录
export async function addUsage(
  db: D1Database,
  params: { userId?: string; ip?: string; charCount: number }
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  if (params.userId) {
    await db
      .prepare(
        `INSERT INTO usage (user_id, date, char_count) VALUES (?, ?, ?)
         ON CONFLICT(user_id, date) DO UPDATE SET char_count = char_count + excluded.char_count`
      )
      .bind(params.userId, today, params.charCount)
      .run();
  } else if (params.ip) {
    await db
      .prepare(
        `INSERT INTO usage (ip, date, char_count) VALUES (?, ?, ?)
         ON CONFLICT(ip, date) DO UPDATE SET char_count = char_count + excluded.char_count`
      )
      .bind(params.ip, today, params.charCount)
      .run();
  }
}

// 保存历史记录
export async function saveHistory(
  db: D1Database,
  data: { userId: string; mode: string; inputText: string; outputText: string; charCount: number }
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO history (user_id, mode, input_text, output_text, char_count) VALUES (?, ?, ?, ?, ?)'
    )
    .bind(data.userId, data.mode, data.inputText, data.outputText, data.charCount)
    .run();
}

// 获取用户历史记录（最近20条）
export async function getUserHistory(db: D1Database, userId: string): Promise<HistoryRecord[]> {
  const results = await db
    .prepare(
      'SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
    )
    .bind(userId)
    .all<HistoryRecord>();
  return results.results;
}

// 更新用户计划
export async function updateUserPlan(
  db: D1Database,
  userId: string,
  plan: 'free' | 'pro',
  expiresAt?: number
): Promise<void> {
  await db
    .prepare('UPDATE users SET plan = ?, pro_expires_at = ? WHERE id = ?')
    .bind(plan, expiresAt ?? null, userId)
    .run();
}

// 获取即将到期的Pro用户（3天内到期）
export async function getExpiringProUsers(db: D1Database): Promise<User[]> {
  const now = Math.floor(Date.now() / 1000);
  const in3Days = now + 3 * 24 * 60 * 60;
  const results = await db
    .prepare(
      "SELECT * FROM users WHERE plan = 'pro' AND pro_expires_at BETWEEN ? AND ?"
    )
    .bind(now, in3Days)
    .all<User>();
  return results.results;
}

// 让已过期的Pro用户降级
export async function downgradeExpiredUsers(db: D1Database): Promise<number> {
  const now = Math.floor(Date.now() / 1000);
  const result = await db
    .prepare(
      "UPDATE users SET plan = 'free' WHERE plan = 'pro' AND pro_expires_at < ?"
    )
    .bind(now)
    .run();
  return result.meta.changes ?? 0;
}
