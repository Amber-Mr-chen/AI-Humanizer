'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for casual use.',
    features: ['1,000 characters per day', 'Standard Mode', 'Basic quality', 'No history save'],
    buttonText: 'Get Started',
    buttonClass: 'bg-white text-violet-600 border border-violet-200 hover:border-violet-300',
    id: 'free'
  },
  {
    name: 'Pro Monthly',
    price: '$7.99',
    description: 'Best for frequent writers.',
    features: ['200,000 chars/month', 'All 3 Writing Modes', 'Advanced quality', 'Unlimited history', '7-Day Money-Back'],
    buttonText: 'Upgrade to Pro',
    buttonClass: 'bg-violet-600 text-white hover:bg-violet-700 shadow-md',
    id: 'monthly'
  },
  {
    name: 'Pro Yearly',
    price: '$49.99',
    description: 'Best value for professionals.',
    features: ['200,000 chars/month', 'All 3 Writing Modes', 'Advanced quality', 'Unlimited history', '7-Day Money-Back'],
    buttonText: 'Upgrade to Pro',
    buttonClass: 'bg-white text-violet-600 border-2 border-violet-600 hover:bg-violet-50',
    id: 'yearly'
  },
];

const FEATURES = [
  { name: 'Monthly Character Limit', free: '30,000', pro: '200,000' },
  { name: 'Advanced Writing Modes', free: 'Standard', pro: 'All 3 Modes' },
  { name: 'History Tracking', free: 'Limited', pro: 'Unlimited' },
  { name: 'Support Priority', free: '-', pro: 'Yes' },
  { name: 'Money-Back Guarantee', free: '-', pro: '7 Days' },
];

export default function PricingPage() {
  const { data: session } = useSession();

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      signIn('google');
      return;
    }
    // Subscription logic...
    window.location.href = `/api/paypal/create-subscription?plan=${planId}`;
  };

  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that fits your writing needs.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {PLANS.map((plan) => (
            <div key={plan.name} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-white mb-4">{plan.price}</div>
              <p className="text-gray-400 mb-6">{plan.description}</p>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-gray-300 flex items-center">
                    <span className="text-violet-400 mr-2">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 rounded-full font-semibold transition-all ${plan.buttonClass}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-4 font-semibold text-gray-900">Feature</th>
                  <th className="pb-4 text-center text-gray-500 font-medium">Free</th>
                  <th className="pb-4 text-center text-violet-600 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {FEATURES.map((f) => (
                  <tr key={f.name}>
                    <td className="py-4 text-gray-700">{f.name}</td>
                    <td className="py-4 text-center text-gray-600">{f.free}</td>
                    <td className="py-4 text-center font-semibold text-violet-700">{f.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">Yes. You can cancel your subscription via PayPal anytime. You will retain Pro access until the end of your current billing period.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a refund policy?</h4>
              <p className="text-gray-600">Yes! We offer a <strong className="text-violet-600">7-Day Money-Back Guarantee</strong>. If you are not satisfied, contact support within 7 days for a full refund (limited to one refund per user).</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
