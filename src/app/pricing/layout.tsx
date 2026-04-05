import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - AI Humanizer',
  description: 'Choose a plan that works for you. Free plan available. Upgrade to Pro for unlimited humanizations.',
  alternates: { canonical: 'https://aihumanizer.life/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
