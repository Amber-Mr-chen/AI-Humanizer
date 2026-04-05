import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AI Humanizer',
  description: 'Terms of Service for AI Humanizer. Read our terms before using the service.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-violet-600 text-sm tracking-widest uppercase font-medium mb-4">Legal</div>
        <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-gray-400 mt-3 text-sm">Last updated: April 5, 2026</p>
      </div>

      <div className="space-y-8 text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using AI Humanizer (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
          <p>AI Humanizer is an AI-powered writing tool that rewrites and refines AI-generated text to sound more natural and human. The output is provided for general writing assistance and does not constitute professional advice of any kind.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
          <p className="mb-2">To access certain features, you may sign in using your Google account. You are responsible for:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Maintaining the security of your account</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscription Plans &amp; Payments</h2>
          <p className="mb-2">We offer the following plans:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
            <li><strong className="text-gray-800">Free:</strong> 1,000 characters per day, Standard mode</li>
            <li><strong className="text-gray-800">Pro Monthly:</strong> $7.99/month — Up to 200,000 chars/month, all 3 writing modes</li>
            <li><strong className="text-gray-800">Pro Yearly:</strong> $49.99/year — Same as Monthly, best value</li>
          </ul>
          <p>Payments are processed securely by PayPal. We do not store your payment information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Policy</h2>
          <div className="rounded-xl p-4 mb-3 bg-violet-50 border border-violet-200">
            <p className="text-violet-700 font-semibold mb-2">✦ 7-Day Money-Back Guarantee</p>
            <p>If you are not satisfied with your Pro subscription, you may request a full refund within <strong className="text-violet-700">7 days</strong> of your purchase date.</p>
          </div>
          <p className="mb-2"><strong className="text-gray-800">Refund conditions:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Refund must be requested within 7 days of purchase</li>
            <li>Each account is eligible for <strong className="text-gray-800">one refund only</strong></li>
            <li>Subsequent purchases are non-refundable</li>
            <li>To request a refund, contact us at: <a href="mailto:support@aihumanizer.life" className="text-violet-600 hover:underline">support@aihumanizer.life</a></li>
          </ul>
          <p className="mt-3 text-sm">Upon approved refund, your account will be downgraded to the Free plan immediately.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Acceptable Use</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Submit content that is harmful, offensive, or violates others&apos; rights</li>
            <li>Attempt to abuse the free tier limits through automated means</li>
            <li>Resell or redistribute the Service or its outputs commercially</li>
            <li>Interfere with or disrupt the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Disclaimer</h2>
          <p>AI Humanizer is a writing assistance tool. We make no guarantees about the accuracy, originality, or fitness for any particular purpose of the output. You are responsible for reviewing and editing all generated content before use.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, AI Humanizer shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>For questions or refund requests, contact us at: <a href="mailto:support@aihumanizer.life" className="text-violet-600 hover:underline">support@aihumanizer.life</a></p>
        </section>

      </div>
    </main>
  );
}
