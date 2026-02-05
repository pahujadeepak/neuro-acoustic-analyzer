import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    ws_port: int = 8001

    # CORS - supports multiple origins for local dev and production
    # Set ALLOWED_ORIGINS env var as comma-separated list for production
    # e.g., "https://your-app.vercel.app,https://your-preview.vercel.app"
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Audio processing
    temp_dir: str = "/tmp/audio"
    max_audio_duration: int = 600  # 10 minutes max
    cleanup_interval: int = 300  # 5 minutes

    # Sample rate for analysis
    sample_rate: int = 22050

    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse comma-separated origins into a list."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    class Config:
        env_file = ".env"


settings = Settings()
