from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[3]
BACKEND_DIR = Path(__file__).resolve().parents[2]

# Force project .env values to override inherited shell env vars.
load_dotenv(ROOT_DIR / ".env", override=True)
load_dotenv(BACKEND_DIR / ".env", override=True)


class Settings(BaseSettings):
    app_name: str = "LogSense"
    app_version: str = "0.1.0"
    debug: bool = False

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    database_url: str = "postgresql+asyncpg://logsense:logsense@db:5432/logsense"
    redis_url: str = "redis://redis:6379/0"

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    log_level: str = "info"

    max_log_batch_size: int = 500
    ai_summary_max_tokens: int = 4096

    model_config = {
        "env_file": (
            str(ROOT_DIR / ".env"),
            str(BACKEND_DIR / ".env"),
            ".env",
        ),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()
