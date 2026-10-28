import { Zap, Shield, Clock } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[var(--accent)] text-xs font-medium mb-6">
          <Zap className="w-3 h-3" />
          Powered by Gemini 2.5
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
          From <span className="text-[var(--accent)]">10,000 logs</span> to{" "}
          <span className="text-[var(--accent)]">1 actionable insight</span>
        </h1>

        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop drowning in logs. Upload your system logs and get instant root-cause analysis,
          severity scoring, and actionable suggestions to resolve incidents faster.
        </p>

        <button
          onClick={onGetStarted}
          className="px-8 py-3 rounded-xl font-semibold text-sm bg-[var(--accent)] text-white
                     hover:brightness-110 transition-all shadow-lg shadow-[var(--accent)]/20 cursor-pointer"
        >
          Analyze Your Logs
        </button>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-6 mt-14">
          <FeaturePill
            icon={<Clock className="w-4 h-4" />}
            title="60% Faster"
            subtitle="incident response"
          />
          <FeaturePill
            icon={<Shield className="w-4 h-4" />}
            title="Root Cause"
            subtitle="detection in seconds"
          />
          <FeaturePill
            icon={<Zap className="w-4 h-4" />}
            title="Smart Triage"
            subtitle="prioritized suggestions"
          />
        </div>
      </div>
    </section>
  );
}

function FeaturePill({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
      <div className="text-[var(--accent)]">{icon}</div>
      <div className="text-left">
        <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
        <div className="text-xs text-[var(--text-secondary)]">{subtitle}</div>
      </div>
    </div>
  );
}
