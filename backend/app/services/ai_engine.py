import json
import logging
from google import genai

from app.core.config import get_settings
from app.prompts.templates import SYSTEM_PROMPT, ANALYZE_PROMPT, MAP_CHUNK_PROMPT, REDUCE_PROMPT

logger = logging.getLogger(__name__)
settings = get_settings()

CHUNK_SIZE = 200  # lines per chunk for map-reduce


class AIConfigurationError(Exception):
    """Raised when AI engine configuration is invalid."""


def _get_client() -> genai.Client:
    api_key = settings.gemini_api_key.strip()
    if not api_key or api_key == "your-gemini-api-key-here":
        raise AIConfigurationError(
            "GEMINI_API_KEY is missing. Add it to your .env file and restart the backend."
        )
    try:
        return genai.Client(api_key=api_key)
    except ValueError as exc:
        raise AIConfigurationError(
            "GEMINI_API_KEY is invalid. Update .env with a valid Gemini API key."
        ) from exc


def _parse_json_response(text: str) -> dict:
    """Extract JSON from Gemini response, handling markdown code fences."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = lines[1:]  # remove opening fence
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        logger.warning("Failed to parse AI response as JSON, returning raw text")
        return {
            "summary": cleaned,
            "root_cause": None,
            "severity_score": 0.5,
            "suggestions": [],
        }


async def _call_gemini(prompt: str) -> str:
    client = _get_client()
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.2,
            max_output_tokens=settings.ai_summary_max_tokens,
        ),
    )
    return response.text


async def analyze_logs(log_lines: list[str]) -> dict:
    """
    Analyze log lines using Gemini.
    Uses direct analysis for small batches, map-reduce for large ones.
    """
    if len(log_lines) <= CHUNK_SIZE:
        return await _analyze_direct(log_lines)
    return await _analyze_map_reduce(log_lines)


async def _analyze_direct(log_lines: list[str]) -> dict:
    logs_text = "\n".join(log_lines)
    prompt = ANALYZE_PROMPT.format(log_count=len(log_lines), logs=logs_text)

    response_text = await _call_gemini(prompt)
    return _parse_json_response(response_text)


async def _analyze_map_reduce(log_lines: list[str]) -> dict:
    """Split large log sets into chunks, summarize each, then combine."""
    chunks = [
        log_lines[i : i + CHUNK_SIZE]
        for i in range(0, len(log_lines), CHUNK_SIZE)
    ]
    total_chunks = len(chunks)

    summaries = []
    for idx, chunk in enumerate(chunks):
        chunk_text = "\n".join(chunk)
        prompt = MAP_CHUNK_PROMPT.format(
            chunk_index=idx + 1,
            total_chunks=total_chunks,
            chunk=chunk_text,
        )
        summary = await _call_gemini(prompt)
        summaries.append(f"[Chunk {idx + 1}] {summary}")

    combined_summaries = "\n\n".join(summaries)
    reduce_prompt = REDUCE_PROMPT.format(
        total_chunks=total_chunks,
        summaries=combined_summaries,
    )

    response_text = await _call_gemini(reduce_prompt)
    return _parse_json_response(response_text)
