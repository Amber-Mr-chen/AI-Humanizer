'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

interface ProfileData {
  name: string | null;
  email: string;
  avatar: string | null;
  plan: 'free' | 'pro';
  proExpiresAt: number | null;
  usedToday: number;
  dailyLimit: number;
  usedThisMonth: number;
  monthlyLimit: number | null;
}

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 打开下拉时拉取用户数据
  const handleAvatarClick = async () => {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (profile) return; // 已有缓存
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (res.ok) setProfile(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const formatExpiry = (ts: number | null) => {
    if (!ts) return 'No expiry';
    return new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const usagePercent = profile
    ? profile.plan === 'pro' && profile.monthlyLimit
      ? Math.min(100, Math.round((profile.usedThisMonth / profile.monthlyLimit) * 100))
      : Math.min(100, Math.round((profile.usedToday / profile.dailyLimit) * 100))
    : 0;

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="font-bold text-gray-900 text-lg">AI Humanizer</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/pricing" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
            Pricing
          </Link>
          {session && (
            <Link href="/history" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              History
            </Link>
          )}

          {session ? (
            <div className="relative" ref={dropdownRef}>
              {/* 头像按钮 */}
              <button
                onClick={handleAvatarClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-violet-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-semibold text-sm">
                    {session.user?.name?.[0] ?? '?'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline truncate max-w-[80px]">
                  {session.user?.name?.split(' ')[0]}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 下拉卡片 */}
              {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  {loading ? (
                    <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
                  ) : profile ? (
                    <>
                      {/* 用户信息 */}
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-lg">
                              {profile.name?.[0] ?? '?'}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{profile.name}</div>
                            <div className="text-xs text-gray-400">{profile.email}</div>
                          </div>
                        </div>
                        {/* 套餐徽章 */}
                        <div className="flex items-center gap-2">
                          {profile.plan === 'pro' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                              ✨ Pro
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                              Free
                            </span>
                          )}
                          {profile.plan === 'pro' && profile.proExpiresAt && (
                            <span className="text-xs text-gray-400">
                              Expires {formatExpiry(profile.proExpiresAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 用量 */}
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-500">
                            {profile.plan === 'pro' ? 'This month' : 'Today'}
                          </span>
                          <span className="text-xs font-medium text-gray-700">
                            {profile.plan === 'pro'
                              ? `${profile.usedThisMonth.toLocaleString()} / ${profile.monthlyLimit?.toLocaleString() ?? '∞'} chars`
                              : `${profile.usedToday.toLocaleString()} / ${profile.dailyLimit.toLocaleString()} chars`
                            }
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${usagePercent > 80 ? 'bg-red-400' : 'bg-violet-500'}`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="p-3 flex flex-col gap-1">
                        <Link
                          href="/history"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span>📋</span> History
                        </Link>
                        {profile.plan === 'free' && (
                          <Link
                            href="/pricing"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-violet-600 hover:bg-violet-50 transition-colors font-medium"
                          >
                            <span>✨</span> Upgrade to Pro
                          </Link>
                        )}
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors w-full text-left"
                        >
                          <span>🚪</span> Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-gray-400 text-sm">Failed to load profile</div>
                  )}
                </div>
              )}
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
