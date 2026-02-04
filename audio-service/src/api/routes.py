import asyncio
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks
from src.api.schemas import AnalyzeRequest, AnalyzeResponse, JobStatus
from src.extractor import extractor, ExtractionError
from src.analyzer import processor, brain_mapper, brainwave_predictor, emotion_classifier
from src.websocket.server import send_progress, send_chunk, send_complete, send_error

logger = logging.getLogger(__name__)

router = APIRouter()

# Simple in-memory job storage (replace with Redis in production)
jobs = {}


def to_camel_case(snake_str: str) -> str:
    """Convert snake_case to camelCase."""
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def convert_keys_to_camel(data: dict) -> dict:
    """Recursively convert all dictionary keys from snake_case to camelCase."""
    if not isinstance(data, dict):
        return data
    return {to_camel_case(k): convert_keys_to_camel(v) for k, v in data.items()}


@router.post("/analyze", response_model=AnalyzeResponse)
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    """Start analysis of a YouTube video."""
    job_id = f"job_{request.video_id}"

    # Check if job already exists and is complete
    if job_id in jobs and jobs[job_id].get("status") == "complete":
        return AnalyzeResponse(
            job_id=job_id,
            video_id=request.video_id,
            status="complete",
            websocket_url=f"ws://localhost:8000"
        )

    # Initialize job
    jobs[job_id] = {
        "status": "pending",
        "progress": 0,
        "video_id": request.video_id,
        "url": request.youtube_url
    }

    # Start extraction in background
    background_tasks.add_task(process_video, job_id, request.youtube_url, request.video_id)

    return AnalyzeResponse(
        job_id=job_id,
        video_id=request.video_id,
        status="pending",
        websocket_url=f"ws://localhost:8000"
    )


async def process_video(job_id: str, url: str, video_id: str):
    """Background task to process video."""
    try:
        # Phase 1: Extract audio
        jobs[job_id]["status"] = "extracting"
        jobs[job_id]["progress"] = 5
        await send_progress(job_id, "extracting", 5, "Starting audio extraction...")

        result = await extractor.extract_audio(url, video_id)

        jobs[job_id]["progress"] = 20
        jobs[job_id]["audio_path"] = result.audio_path
        jobs[job_id]["video_info"] = {
            "title": result.video_info.title,
            "duration": result.video_info.duration,
            "thumbnail_url": result.video_info.thumbnail_url
        }
        await send_progress(job_id, "extracting", 20, "Audio extracted successfully")

        # Phase 2: Analyze audio
        jobs[job_id]["status"] = "analyzing"
        jobs[job_id]["progress"] = 25
        await send_progress(job_id, "analyzing", 25, "Starting audio analysis...")

        # Process audio and generate segments
        segments = []
        audio_path = result.audio_path
        duration = result.video_info.duration

        # Process audio in chunks
        chunk_count = 0
        total_chunks = int(duration)  # 1 second per chunk

        for features in processor.process_audio(audio_path, chunk_duration=1.0):
            chunk_count += 1

            # Map features to brain regions, brainwaves, and emotions
            brain_regions = brain_mapper.map(features)
            brainwaves = brainwave_predictor.predict(features)
            emotion = emotion_classifier.classify(features)

            # Build segment data (camelCase for frontend)
            segment = {
                "startTime": features.timestamp,
                "endTime": features.timestamp + 1.0,
                "frequencies": {
                    "bass": round(features.bass, 3),
                    "lowMid": round(features.low_mid, 3),
                    "mid": round(features.mid, 3),
                    "highMid": round(features.high_mid, 3),
                    "high": round(features.high, 3),
                },
                "brainRegions": {
                    "auditoryCortex": round(brain_regions.auditory_cortex, 3),
                    "amygdala": round(brain_regions.amygdala, 3),
                    "hippocampus": round(brain_regions.hippocampus, 3),
                    "nucleusAccumbens": round(brain_regions.nucleus_accumbens, 3),
                    "motorCortex": round(brain_regions.motor_cortex, 3),
                    "prefrontalCortex": round(brain_regions.prefrontal_cortex, 3),
                    "basalGanglia": round(brain_regions.basal_ganglia, 3),
                },
                "brainwaves": {
                    "delta": round(brainwaves.delta, 3),
                    "theta": round(brainwaves.theta, 3),
                    "alpha": round(brainwaves.alpha, 3),
                    "beta": round(brainwaves.beta, 3),
                    "gamma": round(brainwaves.gamma, 3),
                },
                "emotion": {
                    "primary": emotion.primary,
                    "confidence": round(emotion.confidence, 3),
                },
            }

            segments.append(segment)

            # Send chunk via WebSocket
            await send_chunk(job_id, features.timestamp, segment)

            # Update progress (25% to 90%)
            progress = 25 + int((chunk_count / max(total_chunks, 1)) * 65)
            jobs[job_id]["progress"] = min(progress, 90)

            # Small delay to allow WebSocket events to be sent
            await asyncio.sleep(0.01)

        # Calculate overall emotion (most common primary emotion)
        if segments:
            emotion_counts = {}
            for seg in segments:
                em = seg["emotion"]["primary"]
                emotion_counts[em] = emotion_counts.get(em, 0) + 1
            overall_primary = max(emotion_counts, key=emotion_counts.get)
            overall_confidence = emotion_counts[overall_primary] / len(segments)
        else:
            overall_primary = "calm"
            overall_confidence = 0.5

        # Build complete analysis
        analysis = {
            "id": job_id,
            "video": {
                "id": video_id,
                "title": result.video_info.title,
                "duration": result.video_info.duration,
                "thumbnailUrl": result.video_info.thumbnail_url,
            },
            "overallEmotion": {
                "primary": overall_primary,
                "confidence": round(overall_confidence, 3),
            },
            "segments": segments,
            "analyzedAt": datetime.utcnow().isoformat() + "Z",
        }

        # Mark as complete
        jobs[job_id]["status"] = "complete"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["analysis"] = analysis

        await send_progress(job_id, "complete", 100, "Analysis complete!")
        await send_complete(job_id, analysis)

        logger.info(f"Job {job_id} completed with {len(segments)} segments")

    except ExtractionError as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)
        await send_error(job_id, "EXTRACTION_ERROR", str(e))
        logger.error(f"Job {job_id} extraction error: {e}")

    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = f"Unexpected error: {str(e)}"
        await send_error(job_id, "ANALYSIS_ERROR", str(e))
        logger.exception(f"Job {job_id} unexpected error: {e}")


@router.get("/job/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    """Get status of an analysis job."""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]
    return JobStatus(
        job_id=job_id,
        status=job.get("status", "pending"),
        progress=job.get("progress", 0),
        error=job.get("error")
    )
