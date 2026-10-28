import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException

from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.ai_engine import AIConfigurationError, analyze_logs
from app.services.ingestion import parse_raw_logs
from app.core.config import get_settings

router = APIRouter(prefix="/analysis", tags=["analysis"])
settings = get_settings()


@router.post("/analyze", response_model=AnalysisResponse)
async def run_analysis(request: AnalysisRequest):
    if not request.raw_text and not request.session_id:
        raise HTTPException(
            status_code=400,
            detail="Provide either raw_text or session_id",
        )

    session_id = request.session_id or uuid.uuid4().hex[:16]

    if request.raw_text:
        logs = parse_raw_logs(request.raw_text, source=request.source)
        log_lines = [log.message for log in logs]
    else:
        raise HTTPException(
            status_code=501,
            detail="Session-based analysis not yet implemented. Send raw_text for now.",
        )

    if not log_lines:
        raise HTTPException(status_code=400, detail="No log lines found to analyze")

    try:
        result = await analyze_logs(log_lines)
    except AIConfigurationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return AnalysisResponse(
        session_id=session_id,
        summary=result["summary"],
        root_cause=result.get("root_cause"),
        suggestions=result.get("suggestions", []),
        severity_score=result.get("severity_score", 0.0),
        log_count=len(log_lines),
        model_used=settings.gemini_model,
        created_at=datetime.utcnow(),
    )
