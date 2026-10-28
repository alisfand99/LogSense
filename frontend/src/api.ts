const API_BASE = "/api/v1";

export interface Suggestion {
  action: string;
  priority: string;
  detail: string;
}

export interface AnalysisResult {
  session_id: string;
  summary: string;
  root_cause: string | null;
  suggestions: Suggestion[];
  severity_score: number;
  log_count: number;
  model_used: string;
  created_at: string;
}

export async function analyzeLogs(
  rawText: string,
  source: string = "manual"
): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/analysis/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw_text: rawText, source }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function uploadLogFile(file: File): Promise<{ session_id: string; log_count: number }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/logs/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}
