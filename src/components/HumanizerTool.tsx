'use client';

import { useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';

type Mode = 'standard' | 'academic' | 'creative';

const MODES: { value: Mode; label: string; desc: string }[] = [
  { value: 'standard', label: 'Standard', desc: 'Natural & fluent' },
  { value: 'academic', label: 'Academic', desc: 'Formal but human' },
  { value: 'creative', label: 'Creative', desc: 'Engaging & lively' },
];

export default function HumanizerTool() {
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const charCount = input.length;

  const handleHumanize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, mode }),
      });

      const data = await res.json() as { error?: string; result?: string; charCount?: number };

      if (!res.ok) {
        if (data.error === 'daily_limit_exceeded' || data.error === 'monthly_limit_exceeded') {
          if (!session) {
            setShowLoginModal(true);
          } else {
            setShowUpgradeModal(true);
          }
          return;
        }
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setOutput(data.result ?? '');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard access denied
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">

      {/* Mode Selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              mode === m.value
                ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-300 hover:border-violet-400 hover:text-violet-600'
            }`}
          >
            {m.label}
            <span className="ml-1 text-xs opacity-70">— {m.desc}</span>
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">Your AI text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your AI-generated text here..."
            className="flex-1 min-h-[300px] md:min-h-[600px] bg-white border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-colors"
          />
          {/* Input 按钮行 */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{charCount} characters</span>
            <div className="flex gap-2">
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg border border-gray-200 hover:border-red-200 transition-all"
                >
                  ✕ Clear
                </button>
              )}
              <button
                onClick={handlePaste}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-violet-50 text-gray-600 hover:text-violet-600 rounded-lg border border-gray-200 hover:border-violet-200 transition-all"
              >
                📋 Paste
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">Humanized result</label>

          {loading ? (
            /* Skeleton loading */
            <div className="flex-1 min-h-[300px] md:min-h-[600px] bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full bg-violet-200 animate-pulse" />
                <div className="h-3 w-32 bg-violet-100 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-11/12" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-11/12" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-11/12" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
              <p className="text-xs text-violet-400 mt-6 text-center animate-pulse">Humanizing your text...</p>
            </div>
          ) : (
            <textarea
              ref={outputRef}
              value={output}
              readOnly
              placeholder="Your humanized text will appear here..."
              className="flex-1 min-h-[300px] md:min-h-[600px] bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
            />
          )}

          {/* Output 按钮行 */}
          <div className="flex items-center justify-end gap-2 mt-2">
            {output && (
              <button
                onClick={() => setOutput('')}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg border border-gray-200 hover:border-red-200 transition-all"
              >
                ✕ Clear
              </button>
            )}
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                output
                  ? 'bg-violet-50 hover:bg-violet-100 text-violet-600 border-violet-200 hover:border-violet-300'
                  : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
              }`}
            >
              {copied ? '✓ Copied!' : '📄 Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Humanize Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleHumanize}
          disabled={loading || !input.trim()}
          className="px-12 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-full text-lg transition-all shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Humanizing...
            </span>
          ) : (
            'Humanize'
          )}
        </button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Daily limit reached</h3>
            <p className="text-gray-500 mb-6">Sign in for free to get 1,000 characters/day — 3× more!</p>
            <button
              onClick={() => signIn('google')}
              className="w-full py-3 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 transition-colors"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Limit reached</h3>
            <p className="text-gray-500 mb-6">Upgrade to Pro for up to 200,000 characters per month.</p>
            <a
              href="/pricing"
              className="block w-full py-3 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 transition-colors"
            >
              Upgrade to Pro
            </a>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
