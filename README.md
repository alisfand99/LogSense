# LogSense

> From 10,000 logs to 1 actionable insight.

LLM-powered log analysis tool that transforms chaotic system logs into clear, prioritized insights using Google Gemini.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Setup

```bash
# Clone and configure
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start everything
docker compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Local Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Architecture

```
[Log Input] → [Ingestion & Parsing] → [Gemini AI Engine] → [Dashboard]
                                            ↓
                                    Map-Reduce for large
                                    log sets (500+ lines)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/logs/ingest` | Ingest structured or raw logs |
| `POST` | `/api/v1/logs/upload` | Upload a log file |
| `POST` | `/api/v1/analysis/analyze` | Analyze logs with AI |
| `GET`  | `/health` | Health check |

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Google GenAI SDK
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **AI**: Google Gemini 2.0 Flash
- **Database**: PostgreSQL, Redis
- **Infra**: Docker Compose
