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
