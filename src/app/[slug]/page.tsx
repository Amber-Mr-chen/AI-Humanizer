import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeoPage, seoPages } from '@/lib/seo-pages';

const BASE_URL = 'https://aihumanizer.life';

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: `${page.title} | AI Humanizer`,
    description: page.description,
    alternates: { canonical: `${BASE_URL}/${page.slug}` },
    openGraph: {
      title: `${page.title} | AI Humanizer`,
      description: page.description,
      url: `${BASE_URL}/${page.slug}`,
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default async function SeoLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 md:p-12 border border-gray-100">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">AI Humanizer</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-950 tracking-tight">{page.title}</h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-600 leading-8">{page.description}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors">
              Humanize Text Now
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-gray-800 font-semibold hover:bg-gray-50 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">Natural tone</h2>
            <p className="mt-3 text-gray-600">Smooth robotic phrasing into clearer writing that sounds easier to read.</p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">Keep meaning</h2>
            <p className="mt-3 text-gray-600">Preserve the original intent while improving flow, rhythm, and word choice.</p>
          </div>
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">Fast workflow</h2>
            <p className="mt-3 text-gray-600">Paste your draft, choose a mode, and get a more polished version quickly.</p>
          </div>
        </div>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-950">How it works</h2>
          <ol className="mt-6 space-y-4 text-gray-700 list-decimal list-inside">
            <li>Paste your AI-generated draft into AI Humanizer.</li>
            <li>Select the writing style that best matches your use case.</li>
            <li>Review the rewritten version and make final edits if needed.</li>
          </ol>
        </section>
      </section>
    </main>
  );
}
