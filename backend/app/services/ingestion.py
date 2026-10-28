import re
import logging
from datetime import datetime

from app.schemas.logs import LogLine

logger = logging.getLogger(__name__)

SEVERITY_KEYWORDS = {
    "debug": "debug",
    "info": "info",
    "information": "info",
    "warn": "warning",
    "warning": "warning",
    "error": "error",
    "err": "error",
    "critical": "critical",
    "fatal": "critical",
    "crit": "critical",
    "emergency": "critical",
    "emerg": "critical",
}

TIMESTAMP_PATTERNS = [
    # ISO 8601: 2026-04-16T10:30:00.000Z
    r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?",
    # Syslog: Apr 16 10:30:00
    r"[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}",
    # Common log format: 16/Apr/2026:10:30:00
    r"\d{2}/[A-Z][a-z]{2}/\d{4}:\d{2}:\d{2}:\d{2}",
]

TIMESTAMP_COMBINED = re.compile("|".join(f"({p})" for p in TIMESTAMP_PATTERNS))

SEVERITY_PATTERN = re.compile(
    r"\b(" + "|".join(SEVERITY_KEYWORDS.keys()) + r")\b",
    re.IGNORECASE,
)


def _extract_timestamp(line: str) -> datetime | None:
    match = TIMESTAMP_COMBINED.search(line)
    if not match:
        return None

    ts_str = match.group(0)
    for fmt in [
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S.%f",
        "%Y-%m-%d %H:%M:%S",
        "%b %d %H:%M:%S",
        "%d/%b/%Y:%H:%M:%S",
    ]:
        try:
            return datetime.strptime(ts_str, fmt)
        except ValueError:
            continue
    return None


def _extract_severity(line: str) -> str:
    match = SEVERITY_PATTERN.search(line)
    if match:
        return SEVERITY_KEYWORDS.get(match.group(0).lower(), "info")
    return "info"


def parse_raw_logs(raw_text: str, source: str = "unknown") -> list[LogLine]:
    """Parse raw log text into structured LogLine objects."""
    lines = raw_text.strip().splitlines()
    parsed: list[LogLine] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        parsed.append(
            LogLine(
                timestamp=_extract_timestamp(stripped),
                severity=_extract_severity(stripped),
                source=source,
                message=stripped,
            )
        )

    logger.info(f"Parsed {len(parsed)} log lines from source '{source}'")
    return parsed
