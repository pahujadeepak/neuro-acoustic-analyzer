from fastapi import APIRouter, HTTPException, BackgroundTasks
from src.api.schemas import AnalyzeRequest, AnalyzeResponse, JobStatus
from src.extractor import extractor, ExtractionError

router = APIRouter()

# Simple in-memory job storage (replace with Redis in production)
jobs = {}


@router.post("/analyze", response_model=AnalyzeResponse)
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    """Start analysis of a YouTube video."""
    job_id = f"job_{request.video_id}"

    # Check if job already exists
    if job_id in jobs:
        return AnalyzeResponse(
            job_id=job_id,
            video_id=request.video_id,
            status=jobs[job_id].get("status", "pending"),
            websocket_url=f"ws://localhost:8001/ws/{job_id}"
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
        websocket_url=f"ws://localhost:8001/ws/{job_id}"
    )


async def process_video(job_id: str, url: str, video_id: str):
    """Background task to process video."""
    try:
        jobs[job_id]["status"] = "extracting"
        jobs[job_id]["progress"] = 10

        # Extract audio
        result = await extractor.extract_audio(url, video_id)

        jobs[job_id]["status"] = "analyzing"
        jobs[job_id]["progress"] = 30
        jobs[job_id]["audio_path"] = result.audio_path
        jobs[job_id]["video_info"] = {
            "title": result.video_info.title,
            "duration": result.video_info.duration,
            "thumbnail_url": result.video_info.thumbnail_url
        }

        # TODO: Start analysis (Task 09)
        # For now, mark as complete
        jobs[job_id]["status"] = "complete"
        jobs[job_id]["progress"] = 100

    except ExtractionError as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)
    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = f"Unexpected error: {str(e)}"


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
