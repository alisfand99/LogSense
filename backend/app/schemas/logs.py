from pydantic import BaseModel, Field
from datetime import datetime


class LogLine(BaseModel):
    timestamp: datetime | None = None
    severity: str | None = None
    source: str | None = None
    message: str


class LogBatchRequest(BaseModel):
    logs: list[LogLine] = Field(default=[], description="Structured log lines")
    raw_text: str | None = Field(default=None, description="Raw log text block to parse")
    source: str = Field(default="unknown", description="Log source identifier")


class LogIngestResponse(BaseModel):
    session_id: str
    log_count: int
    message: str
