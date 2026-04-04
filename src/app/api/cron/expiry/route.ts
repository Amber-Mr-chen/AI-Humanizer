// app/api/cron/expiry/route.ts - Pro到期处理
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getExpiringProUsers, downgradeExpiredUsers } from '@/lib/db';

const CRON_SECRET = process.env.CRON_SECRET ?? 'aihumanizer-cron-2026';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext();
    const db = env.DB as D1Database;

    // 降级已过期用户
    const downgraded = await downgradeExpiredUsers(db);

    // 获取即将到期用户（可发提醒邮件）
    const expiring = await getExpiringProUsers(db);

    // TODO: 发送提醒邮件（接Resend后实现）

    return NextResponse.json({
      ok: true,
      downgraded,
      expiringSoon: expiring.length,
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
