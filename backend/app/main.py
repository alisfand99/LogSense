import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.routes import health, logs, analysis

settings = get_settings()

logging.basicConfig(
    level=settings.log_level.upper(),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.getLogger(__name__).info("LogSense starting up")
    yield
    logging.getLogger(__name__).info("LogSense shutting down")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="From 10,000 logs to 1 actionable insight.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(logs.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
