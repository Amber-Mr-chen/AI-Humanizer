'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="font-bold text-white text-lg">AI Humanizer</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/pricing" className="text-white/60 hover:text-white text-sm transition-colors">
            Pricing
          </Link>
          {session && (
            <Link href="/history" className="text-white/60 hover:text-white text-sm transition-colors">
              History
            </Link>
          )}
          {session ? (
            <div className="flex items-center gap-3">
              <img
                src={session.user?.image ?? ''}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={() => signOut()}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-full transition-colors"
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
