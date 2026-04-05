import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geist = Geist({ subsets: ['latin'] });

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Humanizer',
  url: 'https://aihumanizer.life',
  description: 'Free AI Humanizer tool. Transform robotic AI-generated text into natural, engaging, human-quality writing.',
  potentialAction: {
    '@type': 'SearchAction',
    'target': 'https://aihumanizer.life/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const metadata: Metadata = {
  title: 'AI Humanizer - Polish & Refine AI-Generated Text',
  description:
    'Free AI Humanizer tool. Transform robotic AI-generated text into natural, engaging, human-quality writing. Perfect for essays, blogs, emails and more.',
  keywords: 'ai humanizer, humanize ai text, ai text rewriter, ai writing polish, improve ai writing, ai text refiner',
  openGraph: {
    title: 'AI Humanizer - Polish & Refine AI-Generated Text',
    description: 'Transform AI-generated text into natural, human-quality writing. Free to use.',
    url: 'https://aihumanizer.life',
    siteName: 'AI Humanizer',
    type: 'website',
  },
  metadataBase: new URL('https://aihumanizer.life'),
  alternates: { canonical: 'https://aihumanizer.life' },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Humanizer - Polish & Refine AI-Generated Text',
    description: 'Transform AI-generated text into natural, human-quality writing. Free to use.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geist.className} bg-white text-gray-900 min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
