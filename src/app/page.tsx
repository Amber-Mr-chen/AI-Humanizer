import HumanizerTool from '@/components/HumanizerTool';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero — 白色背景 */}
      <section className="bg-white pt-16 pb-12 text-center px-4 border-b border-gray-100">
        <div className="inline-block bg-violet-100 border border-violet-200 text-violet-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
          FREE TO USE · NO ACCOUNT REQUIRED
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          AI Humanizer
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Transform stiff, robotic AI-generated text into natural, engaging writing that sounds genuinely human.
        </p>
      </section>

      {/* Tool — 白色背景 */}
      <section className="bg-white py-12">
        <HumanizerTool />
      </section>

      {/* Features — 浅灰背景 */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Why use AI Humanizer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Instant Results',
                desc: 'Get polished, natural text in seconds. No waiting, no queues.',
              },
              {
                icon: '🎯',
                title: '3 Writing Modes',
                desc: 'Standard, Academic, or Creative — match the tone you need.',
              },
              {
                icon: '✍️',
                title: 'Human-Quality Output',
                desc: 'Varied sentence structure, natural flow, and genuine personality.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — 白色背景 */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            How it works
          </h2>
          <p className="text-gray-500 text-center mb-10">Three simple steps to better writing</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '📋',
                title: 'Paste your text',
                desc: 'Copy your AI-generated content and paste it into the input box.',
              },
              {
                step: '02',
                icon: '🎛️',
                title: 'Choose your style',
                desc: 'Pick Standard, Academic, or Creative mode to match your audience.',
              },
              {
                step: '03',
                icon: '✨',
                title: 'Get refined text',
                desc: 'Click Humanize and receive natural, polished writing instantly.',
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 text-violet-600 font-bold text-lg mb-4">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases — 浅灰背景 */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Who uses AI Humanizer?
          </h2>
          <p className="text-gray-500 text-center mb-10">Built for anyone who writes with AI</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎓',
                title: 'Students',
                desc: 'Polish essays and assignments. Make AI-drafted content sound like your own voice.',
              },
              {
                icon: '✏️',
                title: 'Bloggers & Writers',
                desc: 'Turn rough AI drafts into engaging, readable posts your audience will love.',
              },
              {
                icon: '📣',
                title: 'Marketers',
                desc: 'Craft compelling copy, emails, and social posts that feel authentic and on-brand.',
              },
            ].map((u) => (
              <div
                key={u.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="text-3xl mb-3">{u.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-gray-500 text-sm">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — 深色渐变，引导转化 */}
      <section className="bg-gradient-to-r from-violet-600 to-violet-800 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to write like a human?
        </h2>
        <p className="text-violet-200 mb-8 max-w-md mx-auto">
          Start free today. No credit card required. Upgrade anytime for more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-8 py-3 bg-white text-violet-700 font-semibold rounded-full hover:bg-violet-50 transition-colors"
          >
            Try for Free
          </a>
          <Link
            href="/pricing"
            className="px-8 py-3 border border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'AI Humanizer',
            url: 'https://aihumanizer.life',
            description: 'Free AI Humanizer tool to transform AI-generated text into natural, human-quality writing.',
            applicationCategory: 'UtilitiesApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
    </div>
  );
}
