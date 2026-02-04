# Task 13: Set Up WebSocket Server

> **Phase**: 2 - Audio Service
> **Complexity**: Medium
> **Dependencies**: Task 07
> **Status**: Pending

## Description

Implement the WebSocket server using python-socketio that streams analysis results to connected clients in real-time.

## Acceptance Criteria

- [ ] WebSocket server accepts connections
- [ ] Clients can subscribe to analysis jobs
- [ ] Streams analysis chunks as they're processed
- [ ] Sends progress updates
- [ ] Handles disconnections gracefully
- [ ] CORS configured properly

## Implementation

### Create WebSocket Messages

`audio-service/src/websocket/messages.py`:

```python
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class MessageType(str, Enum):
    CONNECTED = "connected"
    PROGRESS = "progress"
    CHUNK = "chunk"
    COMPLETE = "complete"
    ERROR = "error"


@dataclass
class ConnectedMessage:
    type: str = MessageType.CONNECTED.value
    job_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ProgressMessage:
    status: str
    progress: int
    message: str
    type: str = MessageType.PROGRESS.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ChunkMessage:
    timestamp: float
    segment: Dict[str, Any]
    type: str = MessageType.CHUNK.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class CompleteMessage:
    analysis: Dict[str, Any]
    type: str = MessageType.COMPLETE.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ErrorMessage:
    code: str
    message: str
    type: str = MessageType.ERROR.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
```

### Create WebSocket Server

`audio-service/src/websocket/server.py`:

```python
import asyncio
import logging
from typing import Dict, Set, Optional
import socketio

from src.config import settings
from src.websocket.messages import (
    ConnectedMessage,
    ProgressMessage,
    ChunkMessage,
    CompleteMessage,
    ErrorMessage,
)

logger = logging.getLogger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=settings.allowed_origins,
    logger=True,
    engineio_logger=True,
)

# Track client subscriptions: job_id -> set of session_ids
job_subscribers: Dict[str, Set[str]] = {}

# Track client jobs: session_id -> job_id
client_jobs: Dict[str, str] = {}


@sio.event
async def connect(sid, environ):
    """Handle client connection."""
    logger.info(f"Client connected: {sid}")
    await sio.emit('connected', ConnectedMessage(job_id="").to_dict(), to=sid)


@sio.event
async def disconnect(sid):
    """Handle client disconnection."""
    logger.info(f"Client disconnected: {sid}")

    # Remove from job subscribers
    if sid in client_jobs:
        job_id = client_jobs[sid]
        if job_id in job_subscribers:
            job_subscribers[job_id].discard(sid)
        del client_jobs[sid]


@sio.event
async def subscribe(sid, data):
    """Client subscribes to a job's updates."""
    job_id = data.get('job_id')
    if not job_id:
        await sio.emit('error', ErrorMessage(
            code='INVALID_JOB',
            message='job_id is required'
        ).to_dict(), to=sid)
        return

    # Add to subscribers
    if job_id not in job_subscribers:
        job_subscribers[job_id] = set()

    job_subscribers[job_id].add(sid)
    client_jobs[sid] = job_id

    logger.info(f"Client {sid} subscribed to job {job_id}")

    await sio.emit('subscribed', {'job_id': job_id}, to=sid)


@sio.event
async def unsubscribe(sid, data):
    """Client unsubscribes from a job."""
    job_id = data.get('job_id')
    if job_id and job_id in job_subscribers:
        job_subscribers[job_id].discard(sid)

    if sid in client_jobs:
        del client_jobs[sid]


async def broadcast_to_job(job_id: str, event: str, data: dict):
    """Broadcast message to all subscribers of a job."""
    if job_id not in job_subscribers:
        return

    for sid in job_subscribers[job_id].copy():
        try:
            await sio.emit(event, data, to=sid)
        except Exception as e:
            logger.warning(f"Failed to send to {sid}: {e}")
            job_subscribers[job_id].discard(sid)


async def send_progress(job_id: str, status: str, progress: int, message: str):
    """Send progress update to job subscribers."""
    msg = ProgressMessage(status=status, progress=progress, message=message)
    await broadcast_to_job(job_id, 'progress', msg.to_dict())


async def send_chunk(job_id: str, timestamp: float, segment: dict):
    """Send analysis chunk to job subscribers."""
    msg = ChunkMessage(timestamp=timestamp, segment=segment)
    await broadcast_to_job(job_id, 'chunk', msg.to_dict())


async def send_complete(job_id: str, analysis: dict):
    """Send completion message to job subscribers."""
    msg = CompleteMessage(analysis=analysis)
    await broadcast_to_job(job_id, 'complete', msg.to_dict())


async def send_error(job_id: str, code: str, message: str):
    """Send error message to job subscribers."""
    msg = ErrorMessage(code=code, message=message)
    await broadcast_to_job(job_id, 'error', msg.to_dict())


def cleanup_job(job_id: str):
    """Clean up job subscribers."""
    if job_id in job_subscribers:
        for sid in job_subscribers[job_id]:
            if sid in client_jobs:
                del client_jobs[sid]
        del job_subscribers[job_id]
```

### Create WebSocket Module Export

`audio-service/src/websocket/__init__.py`:

```python
from .server import sio, send_progress, send_chunk, send_complete, send_error, cleanup_job
from .messages import (
    MessageType,
    ConnectedMessage,
    ProgressMessage,
    ChunkMessage,
    CompleteMessage,
    ErrorMessage,
)

__all__ = [
    'sio',
    'send_progress',
    'send_chunk',
    'send_complete',
    'send_error',
    'cleanup_job',
    'MessageType',
    'ConnectedMessage',
    'ProgressMessage',
    'ChunkMessage',
    'CompleteMessage',
    'ErrorMessage',
]
```

### Update Main Application

Update `audio-service/src/main.py`:

```python
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from dotenv import load_dotenv

from src.api.routes import router
from src.config import settings
from src.websocket.server import sio

load_dotenv()

# Create FastAPI app
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

# Mount Socket.IO
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "audio-service"}

@app.get("/")
async def root():
    return {"message": "Neuro-Acoustic Audio Service", "docs": "/docs"}


# Export the combined ASGI app
asgi_app = socket_app
```

### Update Dockerfile CMD

Update `audio-service/Dockerfile`:

```dockerfile
# ... (previous content)

# Run the application with socket support
CMD ["uvicorn", "src.main:asgi_app", "--host", "0.0.0.0", "--port", "8000"]
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `audio-service/src/websocket/messages.py` | Create |
| `audio-service/src/websocket/server.py` | Create |
| `audio-service/src/websocket/__init__.py` | Create |
| `audio-service/src/main.py` | Update |
| `audio-service/Dockerfile` | Update |

## Testing

```python
# test_websocket.py
import asyncio
import socketio

sio = socketio.AsyncClient()

@sio.event
async def connect():
    print('Connected!')
    await sio.emit('subscribe', {'job_id': 'test_job'})

@sio.event
async def progress(data):
    print(f"Progress: {data}")

@sio.event
async def chunk(data):
    print(f"Chunk: t={data['timestamp']}")

@sio.event
async def complete(data):
    print(f"Complete!")

async def main():
    await sio.connect('http://localhost:8000')
    await asyncio.sleep(60)
    await sio.disconnect()

asyncio.run(main())
```

## Notes

- Using python-socketio for WebSocket support
- Socket.IO provides automatic reconnection on client side
- Jobs are identified by job_id, clients subscribe to specific jobs
- Clean up subscriptions when jobs complete or clients disconnect

---

_Task 13 of 28 - neuro-acoustic-analyzer_
