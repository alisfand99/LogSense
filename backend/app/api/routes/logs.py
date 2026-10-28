import uuid
from fastapi import APIRouter, UploadFile, File

from app.schemas.logs import LogBatchRequest, LogIngestResponse
from app.services.ingestion import parse_raw_logs

router = APIRouter(prefix="/logs", tags=["logs"])


@router.post("/ingest", response_model=LogIngestResponse)
async def ingest_logs(request: LogBatchRequest):
    session_id = uuid.uuid4().hex[:16]

    logs = request.logs
    if request.raw_text:
        parsed = parse_raw_logs(request.raw_text, source=request.source)
        logs.extend(parsed)

    return LogIngestResponse(
        session_id=session_id,
        log_count=len(logs),
        message=f"Ingested {len(logs)} log entries",
    )


@router.post("/upload", response_model=LogIngestResponse)
async def upload_log_file(file: UploadFile = File(...)):
    session_id = uuid.uuid4().hex[:16]
    content = await file.read()
    raw_text = content.decode("utf-8", errors="replace")

    logs = parse_raw_logs(raw_text, source=file.filename or "uploaded_file")

    return LogIngestResponse(
        session_id=session_id,
        log_count=len(logs),
        message=f"Uploaded and parsed {len(logs)} log entries from {file.filename}",
    )
