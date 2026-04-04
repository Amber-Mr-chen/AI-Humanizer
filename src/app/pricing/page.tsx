import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - AI Humanizer',
  description: 'Simple pricing for AI Humanizer. Free plan available. Upgrade to Pro for unlimited humanization.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    originalPrice: null,
    highlight: false,
    features: [
      '1,000 characters / day',
      'Standard mode',
      'History (last 20)',
      'Google sign-in',
    ],
    cta: 'Get Started Free',
    ctaHref: '/',
    ctaStyle: 'border',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    originalPrice: '$14.99',
    highlight: true,
    badge: 'MOST POPULAR',
    features: [
      'Unlimited characters',
      'All 3 writing modes',
      'Full history',
      'Priority processing',
      'Email support',
    ],
    cta: 'Upgrade to Pro',
    ctaHref: '/api/paypal/create-subscription?plan=monthly',
    ctaStyle: 'solid',
  },
  {
    name: 'Pro Yearly',
    price: '$59.99',
    period: 'per year',
    originalPrice: '$99.99',
    highlight: false,
    badge: 'SAVE 40%',
    features: [
      'Everything in Pro',
      'Best value',
      '5 months free',
    ],
    cta: 'Get Yearly Plan',
    ctaHref: '/api/paypal/create-subscription?plan=yearly',
    ctaStyle: 'border',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
            LIMITED TIME OFFER
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-white/60 text-lg">Start free. Upgrade when you need more.</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-violet-600/20 border-2 border-violet-500'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>

              <div className="mb-4">
                {plan.originalPrice && (
                  <span className="text-white/40 line-through text-sm mr-2">{plan.originalPrice}</span>
                )}
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-white/50 text-sm ml-1">/{plan.period}</span>
              </div>

              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-violet-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`text-center py-3 rounded-full font-semibold text-sm transition-all ${
                  plan.ctaStyle === 'solid'
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'border border-white/20 hover:border-white/40 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                q: 'Is it really free?',
                a: 'Yes. Free users get 1,000 characters per day with no credit card required.',
              },
              {
                q: 'Can it bypass AI detectors?',
                a: 'Our humanizer significantly reduces AI detection scores on GPTZero, Turnitin, and similar tools.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept PayPal for subscriptions.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel your Pro subscription anytime from PayPal. No questions asked.',
              },
            ].map((item) => (
              <div key={item.q} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                <p className="text-white/60 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
