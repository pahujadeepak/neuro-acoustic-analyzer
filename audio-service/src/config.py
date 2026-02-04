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
