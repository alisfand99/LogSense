import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LogInput from "./components/LogInput";
import ResultPanel from "./components/ResultPanel";
import { analyzeLogs, type AnalysisResult } from "./api";

type AppState = "idle" | "analyzing" | "done" | "error";

function App() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleAnalyze = async (rawText: string) => {
    setState("analyzing");
    setError("");
    setResult(null);

    try {
      const data = await analyzeLogs(rawText);
      setResult(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {state === "idle" && !result && (
        <Hero onGetStarted={() => {
          document.getElementById("log-input")?.scrollIntoView({ behavior: "smooth" });
        }} />
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div id="log-input">
          <LogInput
            onAnalyze={handleAnalyze}
            isLoading={state === "analyzing"}
          />
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}

        {result && (
          <ResultPanel result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-secondary)]">
        LogSense &mdash; AI-Powered Log Intelligence
      </footer>
    </div>
  );
}

export default App;
