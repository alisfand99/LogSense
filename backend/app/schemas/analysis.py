from pydantic import BaseModel
from datetime import datetime


class AnalysisRequest(BaseModel):
    session_id: str | None = None
    raw_text: str | None = None
    source: str = "unknown"


class Suggestion(BaseModel):
    action: str
    priority: str
    detail: str


class AnalysisResponse(BaseModel):
    session_id: str
    summary: str
    root_cause: str | None = None
    suggestions: list[Suggestion] = []
    severity_score: float = 0.0
    log_count: int = 0
    model_used: str
    created_at: datetime
