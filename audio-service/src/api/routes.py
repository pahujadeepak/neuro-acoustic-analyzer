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
