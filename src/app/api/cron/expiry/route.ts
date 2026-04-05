import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { sendEmail } from '@/lib/email';

const CRON_SECRET = process.env.CRON_SECRET ?? 'aihumanizer-cron-2026';
const PRICING_URL = 'https://aihumanizer.life/pricing';

async function sendReminderEmail(to: string, name: string, daysLeft: number): Promise<boolean> {
  const subject = daysLeft <= 1
    ? '⚠️ Your Pro membership expires tomorrow'
    : `✦ Your Pro membership expires in ${daysLeft} days`;

  const firstName = name?.split(' ')[0] ?? 'there';

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #ffffff; color: #1f2937; padding: 40px 20px; max-width: 520px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #7c3aed; font-size: 24px; margin: 0;">AI Humanizer</h1>
  </div>
  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px;">
    <p style="margin-top: 0;">Hi ${firstName},</p>
    <p>Your Pro membership is expiring <strong style="color: #7c3aed;">${daysLeft <= 1 ? 'tomorrow' : `in ${daysLeft} days`}</strong>.</p>
    <p style="color: #6b7280; font-size: 14px;">As a Pro member, you've enjoyed:</p>
    <ul style="color: #4b5563; font-size: 14px; line-height: 1.8;">
      <li>200,000 characters/month</li>
      <li>Advanced Writing Modes (Academic/Creative)</li>
      <li>Unlimited history</li>
      <li>Priority support</li>
    </ul>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${PRICING_URL}" style="background: #7c3aed; color: #ffffff; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">
        ✨ Renew Pro Membership
      </a>
    </div>
    <p style="color: #9ca3af; font-size: 13px; margin-bottom: 0;">Questions? Reply to this email and we'll help.</p>
  </div>
</body>
</html>`;

  await sendEmail(to, subject, html);
  return true;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret');
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext();
    const db = env.DB as D1Database;

    const now = Math.floor(Date.now() / 1000);
    const in3days = now + 3 * 24 * 60 * 60;

    // 1. 降级已过期用户
    await db.prepare("UPDATE users SET plan = 'free' WHERE plan = 'pro' AND pro_expires_at < ?").bind(now).run();

    // 2. 查找即将到期用户
    const { results } = await db.prepare(`
      SELECT email, name, pro_expires_at
      FROM users
      WHERE plan = 'pro'
        AND pro_expires_at > ?
        AND pro_expires_at < ?
        AND (expiry_reminder_sent IS NULL OR expiry_reminder_sent = 0)
    `).bind(now, in3days).all() as { results: Array<{ email: string; name: string; pro_expires_at: number }> };

    let sent = 0;
    for (const user of results) {
      const daysLeft = Math.max(1, Math.ceil((user.pro_expires_at - now) / 86400));
      await sendReminderEmail(user.email, user.name, daysLeft);
      await db.prepare('UPDATE users SET expiry_reminder_sent = 1 WHERE email = ?').bind(user.email).run();
      sent++;
    }

    return NextResponse.json({ ok: true, downgraded: 'processed', remindersSent: sent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
