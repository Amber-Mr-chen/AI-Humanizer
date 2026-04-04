export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-16 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
        <span>© 2026 AI Humanizer. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white/70 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
