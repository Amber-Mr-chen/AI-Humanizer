// app/api/paypal/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { updateUserPlan } from '@/lib/db';

const PAYPAL_API = 'https://api-m.paypal.com';
const WEBHOOK_ID = '6N700294D1010462K';

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

async function verifyWebhookSignature(
  headers: Headers,
  rawBody: string,
  accessToken: string
): Promise<boolean> {
  const payload = {
    auth_algo: headers.get('paypal-auth-algo') ?? '',
    cert_url: headers.get('paypal-cert-url') ?? '',
    transmission_id: headers.get('paypal-transmission-id') ?? '',
    transmission_sig: headers.get('paypal-transmission-sig') ?? '',
    transmission_time: headers.get('paypal-transmission-time') ?? '',
    webhook_id: WEBHOOK_ID,
    webhook_event: JSON.parse(rawBody),
  };
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json() as { verification_status: string };
  return data.verification_status === 'SUCCESS';
}

export async function POST(req: NextRequest) {
  try {
    // 先读取原始body（验证签名必须用原始字符串）
    const rawBody = await req.text();
    const body = JSON.parse(rawBody) as {
      event_type: string;
      resource?: {
        id?: string;
        plan_id?: string;
        subscriber?: { email_address?: string };
      };
    };
    const eventType = body.event_type;

    // 验证PayPal签名
    const accessToken = await getPayPalAccessToken();
    const isValid = await verifyWebhookSignature(req.headers, rawBody, accessToken);
    if (!isValid) {
      console.warn('PayPal webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

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

    // 退款处理：每账号仅限一次，防止重复薅羊毛
    if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      const email = (body.resource as { custom_id?: string })?.custom_id
        ?? body.resource?.subscriber?.email_address;
      if (email) {
        const user = await db
          .prepare('SELECT refund_used, pro_expires_at FROM users WHERE email = ?')
          .bind(email)
          .first<{ refund_used: number; pro_expires_at: number | null }>();

        if (user) {
          if (user.refund_used === 1) {
            // 已用过退款一次，不降级，记录争议
            console.warn('[Webhook] Duplicate refund attempt for:', email);
          } else {
            // 第一次退款：降级为Free，标记refund_used
            await db
              .prepare('UPDATE users SET plan = ?, pro_expires_at = ?, refund_used = 1 WHERE email = ?')
              .bind('free', null, email)
              .run();
            console.log('[Webhook] User refunded and downgraded:', email);
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
