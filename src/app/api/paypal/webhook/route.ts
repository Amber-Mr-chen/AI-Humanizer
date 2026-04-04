// app/api/paypal/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { updateUserPlan } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    const { env } = await getCloudflareContext();
    const db = env.DB as D1Database;

    // 订阅激活
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subId = body.resource?.id;
      const email = body.resource?.subscriber?.email_address;
      if (email) {
        // 根据plan type计算到期时间
        const planId = body.resource?.plan_id;
        const isYearly = planId === process.env.PAYPAL_PLAN_ID_YEARLY;
        const days = isYearly ? 365 : 31;
        const expiresAt = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;

        const user = await db
          .prepare('SELECT * FROM users WHERE email = ?')
          .bind(email)
          .first<{ id: string }>();

        if (user) {
          await updateUserPlan(db, user.id, 'pro', expiresAt);
          // 记录订阅
          await db
            .prepare(
              "INSERT INTO subscriptions (user_id, paypal_sub_id, status, plan_type, expires_at) VALUES (?, ?, 'active', ?, ?)"
            )
            .bind(user.id, subId, isYearly ? 'yearly' : 'monthly', expiresAt)
            .run();
        }
      }
    }

    // 订阅取消
    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
      const email = body.resource?.subscriber?.email_address;
      if (email) {
        const user = await db
          .prepare('SELECT * FROM users WHERE email = ?')
          .bind(email)
          .first<{ id: string }>();
        if (user) {
          await db
            .prepare("UPDATE subscriptions SET status = 'cancelled' WHERE user_id = ?")
            .bind(user.id)
            .run();
          // 保留Pro到期时间，让用户用完已付费期间
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
