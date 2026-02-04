# Task 07: Initialize Python FastAPI Project

> **Phase**: 2 - Audio Service
> **Complexity**: Medium
> **Dependencies**: None (can run parallel to frontend)
> **Status**: Pending

## Description

Set up the Python FastAPI project for the audio processing service. This service handles YouTube audio extraction, analysis, and WebSocket streaming.

## Acceptance Criteria

- [ ] FastAPI project structure created
- [ ] Docker configuration in place
- [ ] Basic health check endpoint works
- [ ] Development environment runs locally
- [ ] Requirements file with all dependencies

## Implementation

### Project Structure

```
audio-service/
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── schemas.py
│   ├── extractor/
│   │   ├── __init__.py
│   │   └── youtube.py
│   ├── analyzer/
│   │   ├── __init__.py
│   │   ├── audio_processor.py
│   │   ├── brain_mapper.py
│   │   ├── emotion_classifier.py
│   │   └── brainwave_predictor.py
│   ├── websocket/
│   │   ├── __init__.py
│   │   ├── server.py
│   │   └── messages.py
│   └── utils/
│       ├── __init__.py
│       └── cleanup.py
├── tests/
│   └── __init__.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

### Create Main Application

`audio-service/src/main.py`:

```python
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.api.routes import router
from src.config import settings

load_dotenv()

app = FastAPI(
    title="Neuro-Acoustic Audio Service",
    description="Audio extraction and analysis service",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "audio-service"}

@app.get("/")
async def root():
    return {"message": "Neuro-Acoustic Audio Service", "docs": "/docs"}
```

### Create Configuration

`audio-service/src/config.py`:

```python
import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    ws_port: int = 8001

    # CORS
    allowed_origins: List[str] = ["http://localhost:3000"]

    # Audio processing
    temp_dir: str = "/tmp/audio"
    max_audio_duration: int = 600  # 10 minutes max
    cleanup_interval: int = 300  # 5 minutes

    # Sample rate for analysis
    sample_rate: int = 22050

    class Config:
        env_file = ".env"

settings = Settings()
```

### Create API Routes (Skeleton)

`audio-service/src/api/routes.py`:

```python
from fastapi import APIRouter, HTTPException
from src.api.schemas import AnalyzeRequest, AnalyzeResponse, JobStatus

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def start_analysis(request: AnalyzeRequest):
    """Start analysis of a YouTube video."""
    # TODO: Implement actual analysis
    job_id = f"job_{request.video_id}"

    return AnalyzeResponse(
        job_id=job_id,
        video_id=request.video_id,
        status="pending",
        websocket_url=f"ws://localhost:8001/ws/{job_id}"
    )

@router.get("/job/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    """Get status of an analysis job."""
    # TODO: Implement job tracking
    return JobStatus(
        job_id=job_id,
        status="pending",
        progress=0
    )
```

### Create Schemas

`audio-service/src/api/schemas.py`:

```python
from typing import Optional, List, Dict
from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    video_id: str
    youtube_url: str

class AnalyzeResponse(BaseModel):
    job_id: str
    video_id: str
    status: str
    websocket_url: str

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: int
    error: Optional[str] = None

class FrequencyBands(BaseModel):
    bass: float
    low_mid: float
    mid: float
    high_mid: float
    high: float

class BrainRegions(BaseModel):
    auditory_cortex: float
    amygdala: float
    hippocampus: float
    nucleus_accumbens: float
    motor_cortex: float
    prefrontal_cortex: float
    basal_ganglia: float

class Brainwaves(BaseModel):
    delta: float
    theta: float
    alpha: float
    beta: float
    gamma: float

class Emotion(BaseModel):
    primary: str
    confidence: float

class AnalysisSegment(BaseModel):
    start_time: float
    end_time: float
    frequencies: FrequencyBands
    brain_regions: BrainRegions
    brainwaves: Brainwaves
    emotion: Emotion
```

### Create Requirements

`audio-service/requirements.txt`:

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-socketio==5.10.0
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0
librosa==0.10.1
numpy==1.26.3
scipy==1.12.0
yt-dlp==2024.1.0
aiofiles==23.2.1
```

### Create Dockerfile

`audio-service/Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Create temp directory
RUN mkdir -p /tmp/audio

# Expose ports
EXPOSE 8000 8001

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Create Docker Compose

`audio-service/docker-compose.yml`:

```yaml
version: '3.8'

services:
  audio-service:
    build: .
    ports:
      - "8000:8000"
      - "8001:8001"
    environment:
      - ALLOWED_ORIGINS=http://localhost:3000
      - TEMP_DIR=/tmp/audio
    volumes:
      - ./src:/app/src
      - audio-temp:/tmp/audio
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  audio-temp:
```

### Create Environment Template

`audio-service/.env.example`:

```env
# Server
HOST=0.0.0.0
PORT=8000
WS_PORT=8001

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Audio processing
TEMP_DIR=/tmp/audio
MAX_AUDIO_DURATION=600
CLEANUP_INTERVAL=300
```

## Files to Create

| File | Description |
|------|-------------|
| `audio-service/src/main.py` | FastAPI application |
| `audio-service/src/config.py` | Configuration |
| `audio-service/src/api/routes.py` | API routes |
| `audio-service/src/api/schemas.py` | Pydantic schemas |
| `audio-service/requirements.txt` | Dependencies |
| `audio-service/Dockerfile` | Docker config |
| `audio-service/docker-compose.yml` | Docker Compose |
| `audio-service/.env.example` | Environment template |

## Testing

```bash
# Run locally
cd audio-service
pip install -r requirements.txt
uvicorn src.main:app --reload

# Test health endpoint
curl http://localhost:8000/health

# Run with Docker
docker-compose up --build

# Test API docs
open http://localhost:8000/docs
```

## Notes

- FastAPI provides automatic OpenAPI docs at `/docs`
- Using Python 3.11 for best compatibility with librosa
- ffmpeg is required for audio processing
- Volume mount allows hot-reloading during development

---

_Task 07 of 28 - neuro-acoustic-analyzer_
