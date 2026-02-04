# Task 26: Deploy Audio Service to Railway

> **Phase**: 5 - Polish & Deploy
> **Complexity**: Medium
> **Dependencies**: Tasks 07-13, 25
> **Status**: Pending

## Description

Deploy the Python audio service to Railway with proper environment configuration, health checks, and WebSocket support.

## Acceptance Criteria

- [ ] Service deploys successfully
- [ ] Health check endpoint works
- [ ] WebSocket connections work
- [ ] Environment variables configured
- [ ] Logs accessible in dashboard
- [ ] Auto-redeploy on git push

## Implementation

### Railway Configuration

Create `audio-service/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### Production Dockerfile

Update `audio-service/Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip install --no-cache-dir yt-dlp

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Run application
CMD ["uvicorn", "src.main:asgi_app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Requirements

Update `audio-service/requirements.txt`:

```
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
python-socketio>=5.10.0
python-dotenv>=1.0.0
librosa>=0.10.1
numpy>=1.24.0
scipy>=1.11.0
pydantic>=2.5.0
pydantic-settings>=2.1.0
yt-dlp>=2023.11.16
aiofiles>=23.2.1
python-multipart>=0.0.6
```

### Environment Configuration

Create `audio-service/.env.example`:

```env
# Server
PORT=8000
HOST=0.0.0.0
DEBUG=false

# CORS
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000

# Audio Processing
MAX_VIDEO_DURATION=600
CHUNK_DURATION=10
TEMP_DIR=/tmp/audio-analysis
```

### Deployment Steps

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login to Railway
   railway login

   # Initialize project
   cd audio-service
   railway init
   ```

2. **Configure Environment Variables**
   In Railway dashboard, set:
   - `ALLOWED_ORIGINS`: Your Vercel domain
   - `DEBUG`: `false`
   - Any other required env vars

3. **Deploy**
   ```bash
   railway up
   ```

4. **Get Service URL**
   ```bash
   railway domain
   ```

### Update Settings for Production

Update `audio-service/src/config.py`:

```python
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False

    # CORS
    allowed_origins: List[str] = ["http://localhost:3000"]

    # Audio Processing
    max_video_duration: int = 600  # 10 minutes
    chunk_duration: int = 10  # seconds
    temp_dir: str = "/tmp/audio-analysis"

    # Parse ALLOWED_ORIGINS from comma-separated string
    @property
    def cors_origins(self) -> List[str]:
        env_origins = os.getenv("ALLOWED_ORIGINS", "")
        if env_origins:
            return [o.strip() for o in env_origins.split(",")]
        return self.allowed_origins

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `audio-service/railway.json` | Create |
| `audio-service/Dockerfile` | Update |
| `audio-service/requirements.txt` | Update |
| `audio-service/.env.example` | Create |
| `audio-service/src/config.py` | Update |

## Testing

- [ ] Health endpoint returns 200
- [ ] WebSocket connection establishes
- [ ] /api/analyze endpoint works
- [ ] Logs show in Railway dashboard
- [ ] Auto-redeploy works

## Post-Deployment

1. Note the Railway service URL (e.g., `https://audio-service-xxx.railway.app`)
2. Use this URL in the Vercel environment configuration (Task 27)

---

_Task 26 of 28 - neuro-acoustic-analyzer_
