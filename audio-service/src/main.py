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
