import os
import asyncio
import logging
import shutil
import subprocess
from typing import Optional
from dataclasses import dataclass
import yt_dlp

from src.config import settings

logger = logging.getLogger(__name__)


def find_node_path() -> str | None:
    """Find the Node.js binary path."""
    # Check common locations
    common_paths = [
        '/usr/bin/node',
        '/usr/local/bin/node',
        '/opt/nodejs/bin/node',
    ]

    for path in common_paths:
        if os.path.exists(path) and os.access(path, os.X_OK):
            logger.info(f"Found Node.js at: {path}")
            return path

    # Try using shutil.which (searches PATH)
    node_path = shutil.which('node')
    if node_path:
        logger.info(f"Found Node.js via PATH: {node_path}")
        return node_path

    # Try running 'which node' as a fallback
    try:
        result = subprocess.run(['which', 'node'], capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            path = result.stdout.strip()
            logger.info(f"Found Node.js via 'which': {path}")
            return path
    except Exception as e:
        logger.debug(f"'which node' failed: {e}")

    logger.warning("Node.js not found - JS challenge solving may fail")
    return None


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

    def _get_base_opts(self, use_cookies: bool = True) -> dict:
        """Get base yt-dlp options.

        With Node.js installed in Docker, we can now use cookies + tv/web clients
        to solve YouTube's JavaScript challenges.
        """
        opts = {
            'quiet': False,  # Enable output for debugging
            'no_warnings': False,
            'verbose': True,
            # Enable downloading the EJS (External JavaScript Solver) from GitHub
            # This is required to solve YouTube's JavaScript challenges
            # Format is a LIST (default=[])
            'remote_components': ['ejs:github'],
        }

        # Explicitly tell yt-dlp where Node.js is located
        # This is required because auto-detection may fail in containerized environments
        node_path = find_node_path()
        if node_path:
            opts['js_runtimes'] = {
                'node': {'path': node_path}
            }
            logger.info(f"Configured yt-dlp to use Node.js at: {node_path}")

        # Use tv/web clients with cookies (requires JS runtime - Node.js installed in Docker)
        extractor_args = {
            'youtube': {
                'player_client': ['tv', 'web'],
                'player_skip': ['android', 'ios'],
            }
        }

        # Always try to use cookies if available
        if use_cookies:
            cookies_file = self._get_cookies_file()
            if cookies_file:
                opts['cookiefile'] = cookies_file
                logger.info(f"Using cookies file: {cookies_file}")
            else:
                logger.warning("No cookies available - YouTube may block requests")
        else:
            # Fallback to android_vr without cookies
            extractor_args = {
                'youtube': {
                    'player_client': ['android_vr'],
                }
            }
            logger.info("Using android_vr client (no cookies)")

        # Use PO Token if available (helps with bot detection)
        po_token = os.environ.get('YOUTUBE_PO_TOKEN')
        if po_token:
            extractor_args['youtube']['po_token'] = [po_token]

        opts['extractor_args'] = extractor_args
        return opts

    def _get_cookies_file(self) -> str | None:
        """Get cookies file path, creating from env var if needed."""
        # Option 1: Direct file path
        cookies_file = os.environ.get('YOUTUBE_COOKIES_FILE')
        if cookies_file and os.path.exists(cookies_file):
            return cookies_file

        # Option 2: Cookies content in environment variable
        cookies_content = os.environ.get('YOUTUBE_COOKIES')
        if cookies_content:
            cookies_path = os.path.join(self.output_dir, 'cookies.txt')
            try:
                with open(cookies_path, 'w') as f:
                    f.write(cookies_content)
                logger.info(f"Created cookies file from env var: {cookies_path}")
                return cookies_path
            except Exception as e:
                logger.error(f"Failed to write cookies file: {e}")

        return None

    def _get_ydl_opts(self, output_path: str, use_cookies: bool = True) -> dict:
        """Get yt-dlp options for audio extraction."""
        opts = self._get_base_opts(use_cookies=use_cookies)
        opts.update({
            # Use 'ba' (best audio) or fallback to worst quality if needed
            # This is the most permissive format selector
            'format': 'ba/b/worst',
            'outtmpl': output_path,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'extract_flat': False,
            # Additional options for compatibility
            'prefer_ffmpeg': True,
            'keepvideo': False,
            # Force IPv4 to avoid some network issues
            'source_address': '0.0.0.0',
        })
        return opts

    def _get_info_opts(self) -> dict:
        """Get yt-dlp options for info extraction only."""
        opts = self._get_base_opts()
        opts.update({
            'extract_flat': True,
        })
        return opts

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

        def _download(use_cookies: bool = True):
            opts = self._get_ydl_opts(output_template, use_cookies=use_cookies)

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

            # Try WITH cookies first (tv/web clients + Node.js for JS challenges)
            # Fall back to android_vr without cookies if that fails
            try:
                logger.info("Attempting download with cookies (tv/web clients)...")
                video_info = await loop.run_in_executor(None, lambda: _download(use_cookies=True))
            except yt_dlp.DownloadError as e:
                error_msg = str(e).lower()
                # If format/JS issue, try android_vr without cookies as last resort
                if 'format' in error_msg or 'not available' in error_msg:
                    logger.warning("Format error, retrying with android_vr (no cookies)...")
                    video_info = await loop.run_in_executor(None, lambda: _download(use_cookies=False))
                else:
                    raise

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
        except ExtractionError:
            raise
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
