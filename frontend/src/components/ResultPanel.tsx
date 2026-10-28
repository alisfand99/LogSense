import {
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Lightbulb,
  RotateCcw,
  BarChart3,
  Cpu,
} from "lucide-react";
import type { AnalysisResult, Suggestion } from "../api";

interface ResultPanelProps {
  result: AnalysisResult;
  onReset: () => void;
}

function severityColor(score: number): string {
  if (score >= 0.8) return "var(--severity-critical)";
  if (score >= 0.6) return "var(--severity-error)";
  if (score >= 0.4) return "var(--severity-warning)";
  if (score >= 0.2) return "var(--severity-info)";
  return "var(--success)";
}

function severityLabel(score: number): string {
  if (score >= 0.8) return "Critical";
  if (score >= 0.6) return "High";
  if (score >= 0.4) return "Medium";
  if (score >= 0.2) return "Low";
  return "Healthy";
}

function priorityBadgeColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "critical":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  }
}

function SeverityGauge({ score }: { score: number }) {
  const color = severityColor(score);
  const pct = Math.round(score * 100);
  const circumference = 2 * Math.PI * 40;
  const filled = circumference * score;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{pct}</span>
        <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">
          {severityLabel(score)}
        </span>
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion, index }: { suggestion: Suggestion; index: number }) {
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-bold text-[var(--accent)]">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-[var(--text-primary)]">
              {suggestion.action}
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${priorityBadgeColor(suggestion.priority)}`}
            >
              {suggestion.priority}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {suggestion.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  const color = severityColor(result.severity_score);

  return (
    <div className="mt-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Diagnosis Complete
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {result.log_count.toLocaleString()} logs analyzed in seconds
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl
                     border border-[var(--border)] text-[var(--text-secondary)]
                     hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Analysis
        </button>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col items-center">
          <SeverityGauge score={result.severity_score} />
          <span className="text-xs text-[var(--text-secondary)] mt-2">Severity Score</span>
        </div>

        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-[var(--severity-info)]" />
            <span className="text-xs text-[var(--text-secondary)]">Logs Analyzed</span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {result.log_count.toLocaleString()}
          </div>
          <span className="text-xs text-[var(--text-secondary)] mt-1">
            log entries processed
          </span>
        </div>

        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs text-[var(--text-secondary)]">AI Model</span>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {result.model_used}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle className="w-3 h-3 text-[var(--success)]" />
            <span className="text-xs text-[var(--success)]">Analysis successful</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Summary
          </h3>
        </div>
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Root Cause */}
      {result.root_cause && (
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
             style={{ borderColor: `${color}30` }}>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" style={{ color }} />
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Root Cause
            </h3>
            <AlertTriangle className="w-3.5 h-3.5" style={{ color }} />
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
            {result.root_cause}
          </p>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-[var(--severity-warning)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Recommended Actions
            </h3>
          </div>
          <div className="space-y-3">
            {result.suggestions.map((s, i) => (
              <SuggestionCard key={i} suggestion={s} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
