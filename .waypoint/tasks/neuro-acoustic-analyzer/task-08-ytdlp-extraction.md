# Task 08: Implement yt-dlp Audio Extraction

> **Phase**: 2 - Audio Service
> **Complexity**: Medium
> **Dependencies**: Task 07
> **Status**: Pending

## Description

Implement the YouTube audio extraction module using yt-dlp. This downloads the audio from a YouTube video and converts it to a format suitable for analysis.

## Acceptance Criteria

- [ ] Extract audio from YouTube URL
- [ ] Convert to MP3/WAV format
- [ ] Handle extraction errors gracefully
- [ ] Get video metadata (title, duration)
- [ ] Cleanup temporary files
- [ ] Support various YouTube URL formats

## Implementation

### Create YouTube Extractor

`audio-service/src/extractor/youtube.py`:

```python
import os
import asyncio
import logging
from typing import Optional, Tuple
from dataclasses import dataclass
import yt_dlp

from src.config import settings

logger = logging.getLogger(__name__)

@dataclass
class VideoInfo:
    id: str
    title: str
    duration: int  # seconds
    thumbnail_url: str

@dataclass
class ExtractionResult:
    audio_path: str
    video_info: VideoInfo

class YouTubeExtractor:
    """Extracts audio from YouTube videos using yt-dlp."""

    def __init__(self, output_dir: Optional[str] = None):
        self.output_dir = output_dir or settings.temp_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def _get_ydl_opts(self, output_path: str) -> dict:
        """Get yt-dlp options for audio extraction."""
        return {
            'format': 'bestaudio/best',
            'outtmpl': output_path,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }

    def _get_info_opts(self) -> dict:
        """Get yt-dlp options for info extraction only."""
        return {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
        }

    async def get_video_info(self, url: str) -> VideoInfo:
        """Get video information without downloading."""
        def _extract_info():
            with yt_dlp.YoutubeDL(self._get_info_opts()) as ydl:
                info = ydl.extract_info(url, download=False)
                return VideoInfo(
                    id=info.get('id', ''),
                    title=info.get('title', 'Unknown'),
                    duration=info.get('duration', 0),
                    thumbnail_url=info.get('thumbnail', '')
                )

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _extract_info)

    async def extract_audio(self, url: str, video_id: str) -> ExtractionResult:
        """
        Extract audio from a YouTube video.

        Args:
            url: YouTube video URL
            video_id: Video ID for naming the output file

        Returns:
            ExtractionResult with audio path and video info

        Raises:
            ExtractionError: If extraction fails
        """
        output_template = os.path.join(self.output_dir, f"{video_id}")
        final_path = f"{output_template}.mp3"

        def _download():
            opts = self._get_ydl_opts(output_template)

            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=True)

                return VideoInfo(
                    id=info.get('id', video_id),
                    title=info.get('title', 'Unknown'),
                    duration=info.get('duration', 0),
                    thumbnail_url=info.get('thumbnail', '')
                )

        try:
            logger.info(f"Starting extraction for video: {video_id}")

            loop = asyncio.get_event_loop()
            video_info = await loop.run_in_executor(None, _download)

            # Verify file exists
            if not os.path.exists(final_path):
                raise ExtractionError(f"Audio file not created: {final_path}")

            # Check duration limit
            if video_info.duration > settings.max_audio_duration:
                os.remove(final_path)
                raise ExtractionError(
                    f"Video too long: {video_info.duration}s "
                    f"(max: {settings.max_audio_duration}s)"
                )

            logger.info(f"Extraction complete: {final_path}")

            return ExtractionResult(
                audio_path=final_path,
                video_info=video_info
            )

        except yt_dlp.DownloadError as e:
            logger.error(f"yt-dlp download error: {e}")
            raise ExtractionError(f"Failed to download video: {str(e)}")
        except Exception as e:
            logger.error(f"Extraction error: {e}")
            raise ExtractionError(f"Extraction failed: {str(e)}")

    def cleanup(self, audio_path: str) -> None:
        """Remove temporary audio file."""
        try:
            if os.path.exists(audio_path):
                os.remove(audio_path)
                logger.info(f"Cleaned up: {audio_path}")
        except Exception as e:
            logger.warning(f"Cleanup failed for {audio_path}: {e}")


class ExtractionError(Exception):
    """Custom exception for extraction errors."""
    pass


# Singleton instance
extractor = YouTubeExtractor()
```

### Create Utility Functions

`audio-service/src/extractor/__init__.py`:

```python
from .youtube import YouTubeExtractor, ExtractionResult, VideoInfo, ExtractionError, extractor

__all__ = [
    'YouTubeExtractor',
    'ExtractionResult',
    'VideoInfo',
    'ExtractionError',
    'extractor'
]
```

### Update API Routes

Update `audio-service/src/api/routes.py`:

```python
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

    except ExtractionError as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)
    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = f"Unexpected error: {str(e)}"
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `audio-service/src/extractor/youtube.py` | Create |
| `audio-service/src/extractor/__init__.py` | Create |
| `audio-service/src/api/routes.py` | Update |

## Testing

```python
# test_extractor.py
import asyncio
from src.extractor import extractor

async def test_extraction():
    url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    video_id = "dQw4w9WgXcQ"

    # Test info extraction
    info = await extractor.get_video_info(url)
    print(f"Title: {info.title}")
    print(f"Duration: {info.duration}s")

    # Test full extraction
    result = await extractor.extract_audio(url, video_id)
    print(f"Audio saved to: {result.audio_path}")

    # Cleanup
    extractor.cleanup(result.audio_path)

asyncio.run(test_extraction())
```

### Manual Testing

```bash
# Start the service
uvicorn src.main:app --reload

# Test extraction
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"video_id": "dQw4w9WgXcQ", "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Check job status
curl http://localhost:8000/api/job/job_dQw4w9WgXcQ
```

## Notes

- yt-dlp runs in executor to avoid blocking async
- Audio files saved temporarily, cleaned up after analysis
- Duration limit prevents processing very long videos
- Video info extraction is separate for quick metadata access

---

_Task 08 of 28 - neuro-acoustic-analyzer_
