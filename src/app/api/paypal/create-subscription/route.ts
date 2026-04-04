// app/api/paypal/create-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API = 'https://api-m.paypal.com';

// Plan IDs (在PayPal后台创建后填入)
const PLAN_IDS = {
  monthly: process.env.PAYPAL_PLAN_ID_MONTHLY ?? '',
  yearly: process.env.PAYPAL_PLAN_ID_YEARLY ?? '',
};

async function getPayPalToken(): Promise<string> {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get('plan') as 'monthly' | 'yearly';
  const planId = PLAN_IDS[plan];

  if (!planId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  try {
    const token = await getPayPalToken();

    const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          return_url: 'https://aihumanizer.life/payment-success',
          cancel_url: 'https://aihumanizer.life/pricing',
          brand_name: 'AI Humanizer',
          user_action: 'SUBSCRIBE_NOW',
        },
      }),
    });

    const data = await res.json() as { links?: { rel: string; href: string }[] };
    const approveLink = data.links?.find((l) => l.rel === 'approve')?.href;

    if (approveLink) {
      return NextResponse.redirect(approveLink);
    }

    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  } catch (error) {
    console.error('PayPal error:', error);
    return NextResponse.json({ error: 'PayPal error' }, { status: 500 });
  }
}
