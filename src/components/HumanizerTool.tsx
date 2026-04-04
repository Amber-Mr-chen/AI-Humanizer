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

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'daily_limit_exceeded') {
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

      setOutput(data.result);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
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
      <div className="flex gap-2 mb-4 flex-wrap">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === m.value
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {m.label}
            <span className="ml-1 text-xs opacity-70">— {m.desc}</span>
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">Paste AI-generated text</label>
            <span className="text-xs text-white/50">{charCount} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your AI-generated text here..."
            className="flex-1 min-h-[300px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">Humanized text</label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-violet-300 hover:text-violet-100 transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            ref={outputRef}
            value={output}
            readOnly
            placeholder={loading ? 'Humanizing...' : 'Humanized text will appear here...'}
            className="flex-1 min-h-[300px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Humanize Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleHumanize}
          disabled={loading || !input.trim()}
          className="px-10 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-full text-lg transition-all shadow-lg hover:shadow-violet-500/30"
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
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-xl font-bold text-white mb-2">Daily limit reached</h3>
            <p className="text-white/60 mb-6">Sign in for free to get 1,000 characters/day — 3× more!</p>
            <button
              onClick={() => signIn('google')}
              className="w-full py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-3 text-sm text-white/40 hover:text-white/60"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-xl font-bold text-white mb-2">Daily limit reached</h3>
            <p className="text-white/60 mb-6">Upgrade to Pro for unlimited humanization every day.</p>
            <a
              href="/pricing"
              className="block w-full py-3 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-500 transition-colors"
            >
              Upgrade to Pro
            </a>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="mt-3 text-sm text-white/40 hover:text-white/60"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
