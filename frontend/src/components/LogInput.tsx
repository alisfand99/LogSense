import { useState, useRef } from "react";
import { Upload, Zap, FileText, ArrowRight } from "lucide-react";

interface LogInputProps {
  onAnalyze: (rawText: string) => void;
  isLoading: boolean;
}

export default function LogInput({ onAnalyze, isLoading }: LogInputProps) {
  const [text, setText] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFile = async (file: File) => {
    const content = await file.text();
    setText(content);
    setPasteMode(true);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  };

  const openPasteMode = () => {
    setPasteMode(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const lineCount = text.trim() ? text.trim().split("\n").length : 0;
  const showInitialView = !text && !pasteMode;

  if (showInitialView) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
            Get Started
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Upload a log file or paste your logs to begin analysis
          </p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`
            relative p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer
            ${dragActive
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-secondary)]/30"
            }
          `}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".log,.txt,.json,.csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Drop your log file here, or click to browse
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Supports .log, .txt, .json, .csv
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-secondary)] font-medium">or paste directly</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Paste area trigger */}
        <div
          onClick={openPasteMode}
          className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
                     hover:border-[var(--accent)]/40 hover:bg-[var(--bg-card)] transition-all cursor-text min-h-[120px]
                     flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-[var(--text-secondary)]">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Click here to paste your log output</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          Your Logs
        </h2>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".log,.txt,.json,.csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg
                       border border-[var(--border)] text-[var(--text-secondary)]
                       hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Replace with File
          </button>
          <button
            onClick={() => { setText(""); setPasteMode(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg
                       border border-[var(--border)] text-[var(--text-secondary)]
                       hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        id="log-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your log output here..."
        rows={20}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
                   p-4 font-mono text-[13px] leading-relaxed text-[var(--text-primary)]
                   placeholder:text-[var(--text-secondary)]/40
                   focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 resize-y
                   min-h-[350px]"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)]">
          {lineCount.toLocaleString()} lines ready for analysis
        </span>
        <button
          onClick={() => onAnalyze(text)}
          disabled={isLoading || !text.trim()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
                     bg-[var(--accent)] text-white
                     hover:brightness-110 transition-all
                     shadow-lg shadow-[var(--accent)]/20
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Analyze
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
