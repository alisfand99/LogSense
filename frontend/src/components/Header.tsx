export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logsense-logo.svg"
            alt="LogSense"
            className="h-8 w-auto object-contain"
          />
        </div>

        <nav className="flex items-center gap-1">
          <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
            v0.1.0
          </span>
        </nav>
      </div>
    </header>
  );
}
