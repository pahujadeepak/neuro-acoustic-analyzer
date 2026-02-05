import logging
from typing import Dict, Set
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
    cors_allowed_origins=settings.allowed_origins_list,
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
