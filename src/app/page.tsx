import HumanizerTool from '@/components/HumanizerTool';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950">
      {/* Hero */}
      <section className="pt-16 pb-10 text-center px-4">
        <div className="inline-block bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
          FREE TO USE · NO ACCOUNT REQUIRED
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          AI Humanizer
        </h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
          Transform AI-generated text into natural, human-sounding content instantly.
          Bypass AI detectors with one click.
        </p>
      </section>

      {/* Tool */}
      <section className="pb-16">
        <HumanizerTool />
      </section>

      {/* Features */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Why use AI Humanizer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Instant Results',
                desc: 'Get humanized text in seconds. No waiting, no queues.',
              },
              {
                icon: '🎯',
                title: '3 Writing Modes',
                desc: 'Standard, Academic, or Creative — match your writing style.',
              },
              {
                icon: '🔒',
                title: 'Bypass AI Detectors',
                desc: 'Rewritten text passes GPTZero, Turnitin, and more.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
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
            description: 'Free AI Humanizer tool to make AI-generated text sound natural and human.',
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
