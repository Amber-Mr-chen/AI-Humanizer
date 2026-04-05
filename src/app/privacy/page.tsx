import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Humanizer',
  description: 'Privacy Policy for AI Humanizer. Learn how we collect, use, and protect your personal data.',
  alternates: { canonical: 'https://aihumanizer.life/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-violet-600 text-sm tracking-widest uppercase font-medium mb-4">Legal</div>
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-400 mt-3 text-sm">Last updated: April 5, 2026</p>
      </div>

      <div className="space-y-8 text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p className="mb-3">When you use AI Humanizer, we collect:</p>

          <h3 className="font-semibold text-gray-800 mb-2">Account Information (via Google OAuth)</h3>
          <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
            <li>Email address</li>
            <li>Name</li>
            <li>Profile picture</li>
          </ul>

          <h3 className="font-semibold text-gray-800 mb-2">Usage Data</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Humanized text history (input and output)</li>
            <li>Character count usage per day / month</li>
            <li>Subscription plan and payment status</li>
            <li>IP address (for rate limiting)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Provide and improve the Service</li>
            <li>Manage your account and subscription</li>
            <li>Enforce usage limits (Free vs. Pro)</li>
            <li>Process payments via PayPal</li>
            <li>Respond to support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage</h2>
          <p>Your data is stored securely on Cloudflare&apos;s infrastructure. We use industry-standard encryption and security practices.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
          <p className="mb-2">We use the following third-party services:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-gray-800">Google OAuth:</strong> For authentication</li>
            <li><strong className="text-gray-800">PayPal:</strong> For payment processing</li>
            <li><strong className="text-gray-800">Cloudflare:</strong> For hosting and infrastructure</li>
            <li><strong className="text-gray-800">SiliconFlow:</strong> For AI text processing (your text is not stored by them)</li>
          </ul>
          <p className="mt-3">These services have their own privacy policies. We do not share your data with any other third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Access your personal data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your humanization history</li>
          </ul>
          <p className="mt-3">To exercise these rights, contact us at: <a href="mailto:support@aihumanizer.life" className="text-violet-600 hover:underline">support@aihumanizer.life</a></p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
          <p>We retain your data for as long as your account is active. If you delete your account, we will delete your personal information within 30 days, except where required by law.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
          <p>AI Humanizer is not intended for users under 13 years of age. We do not knowingly collect information from children.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>For privacy-related questions, contact us at: <a href="mailto:support@aihumanizer.life" className="text-violet-600 hover:underline">support@aihumanizer.life</a></p>
        </section>

      </div>
    </main>
  );
}
