import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Humanizer - Free Online Tool to Humanize AI Text',
  description:
    'Free AI Humanizer tool. Make AI-generated text undetectable. Paste your AI content and get natural, human-like text instantly. Works for essays, blogs, and more.',
  keywords: 'ai humanizer, humanize ai text, ai text humanizer, free ai humanizer, undetectable ai',
  openGraph: {
    title: 'AI Humanizer - Free Online Tool to Humanize AI Text',
    description: 'Make AI-generated text sound natural and human. Free to use.',
    url: 'https://aihumanizer.life',
    siteName: 'AI Humanizer',
    type: 'website',
  },
  metadataBase: new URL('https://aihumanizer.life'),
  alternates: { canonical: 'https://aihumanizer.life' },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Humanizer - Free Online Tool to Humanize AI Text',
    description: 'Make AI-generated text sound natural and human. Free to use.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen flex flex-col`}>
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
