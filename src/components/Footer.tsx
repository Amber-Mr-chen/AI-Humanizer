import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-6 bg-white">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
        <span>© 2026 AI Humanizer. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
