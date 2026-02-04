# Discovery: Vercel Deployment Feasibility

**Discovery Date**: 2026-02-04
**Status**: Complete
**Domain**: Deployment & Infrastructure

---

## Executive Summary

This project **cannot be fully deployed to Vercel** due to fundamental architectural constraints. The project has a two-service architecture:

| Component | Vercel Compatible | Recommendation |
|-----------|-------------------|----------------|
| Next.js Frontend | ✅ Yes | Deploy to Vercel |
| Python Audio Service | ❌ No | Deploy to Railway/Render/Fly.io |

---

## 1. Project Architecture Analysis

### Frontend (Next.js)
- **Framework**: Next.js 16.x with App Router
- **Dependencies**: React 19, Tailwind CSS, Three.js, Socket.IO client
- **Size**: ~50MB bundle (within limits)
- **Vercel Status**: ✅ Fully compatible

### Backend (Python FastAPI)
- **Framework**: FastAPI with Socket.IO
- **Critical Dependencies**:
  - `librosa` - Audio feature extraction
  - `yt-dlp` - YouTube audio extraction
  - `ffmpeg` - Audio processing (system binary)
  - `numpy`, `scipy` - Scientific computing
- **Total Size**: ~300MB+ (exceeds 250MB limit)
- **Vercel Status**: ❌ Not compatible

---

## 2. Vercel Limitations Analysis

### 2.1 Size Limits (BLOCKING)
| Limit Type | Value | Our Backend |
|------------|-------|-------------|
| Compressed Function | 50 MB | ~60 MB |
| Uncompressed Function | 250 MB | ~300+ MB |

**Impact**: librosa + numpy + scipy alone exceed the uncompressed limit.

### 2.2 System Binary Dependencies (BLOCKING)
- **ffmpeg**: Required for audio conversion, **not available** on Vercel
- **yt-dlp**: Requires ffmpeg for audio extraction
- Vercel serverless functions cannot install system-level binaries

### 2.3 WebSocket Support (BLOCKING)
> "Serverless Functions do not support WebSockets. Vercel is not compatible with WebSockets."
> — [Vercel KB](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections)

Our application uses Socket.IO for:
- Real-time analysis progress updates
- Streaming segment data as analysis progresses
- Complete analysis delivery

### 2.4 Execution Time Limits (POTENTIAL ISSUE)
| Plan | Timeout |
|------|---------|
| Hobby | 10 seconds |
| Pro | 60 seconds |
| Pro with Fluid Compute | 800 seconds |

Audio extraction and analysis can take 2-5+ minutes for longer videos.

### 2.5 Filesystem Constraints
- Read-only filesystem (except `/tmp`)
- `/tmp` limited to 500 MB
- Audio files require temporary storage during processing

---

## 3. Deployment Recommendation

### Architecture: Split Deployment

```
┌─────────────────────────────────────────────────────────┐
│                      VERCEL                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Next.js Frontend                       │    │
│  │  • App Router pages                              │    │
│  │  • API route (/api/analyze) → proxy to backend   │    │
│  │  • Static assets                                 │    │
│  │  • Socket.IO client connects to external server  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS + WebSocket
                           ▼
┌─────────────────────────────────────────────────────────┐
│              RAILWAY / RENDER / FLY.IO                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Python Audio Service                   │    │
│  │  • FastAPI REST endpoints                        │    │
│  │  • Socket.IO WebSocket server                    │    │
│  │  • yt-dlp + ffmpeg audio extraction              │    │
│  │  • librosa audio analysis                        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 3.1 Frontend on Vercel

**What works:**
- Next.js pages and API routes
- Static asset serving
- Edge functions for simple operations
- Environment variable management

**Configuration needed:**
```env
# .env.local / Vercel Environment Variables
NEXT_PUBLIC_AUDIO_SERVICE_URL=https://your-railway-app.railway.app
```

### 3.2 Backend Platform Comparison

| Platform | Docker | ffmpeg | WebSocket | Pricing | Recommendation |
|----------|--------|--------|-----------|---------|----------------|
| **Railway** | ✅ | ✅ | ✅ | $5/mo+ | ⭐ Best for this project |
| **Render** | ✅ | ✅ | ✅ | $7/mo+ | Good alternative |
| **Fly.io** | ✅ | ✅ | ✅ | $0/mo+ | Good for scale |

**Railway Recommended** because:
- Native Docker support with auto-detection
- Easy environment variable management
- Direct GitHub integration
- Reasonable pricing for hobby projects
- Already mentioned in project's technical plan

---

## 4. Implementation Plan

### Step 1: Prepare Backend for Railway

The existing Dockerfile at `audio-service/Dockerfile` should work. Verify it includes:

```dockerfile
FROM python:3.11-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2: Deploy Backend to Railway

1. Create Railway account at https://railway.app
2. Create new project from GitHub repo
3. Select the `audio-service` directory as root
4. Railway auto-detects Dockerfile
5. Set environment variables if needed
6. Deploy and get public URL

### Step 3: Deploy Frontend to Vercel

1. Connect GitHub repo to Vercel
2. Set root directory to `/` (Next.js is at root)
3. Add environment variable:
   ```
   NEXT_PUBLIC_AUDIO_SERVICE_URL=https://your-app.railway.app
   ```
4. Deploy

### Step 4: Update CORS Configuration

In `audio-service/src/main.py`, ensure CORS allows Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",
        "https://*.vercel.app",  # For preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 5. Alternative Approaches Considered

### 5.1 Full Vercel with Third-Party Services
- Use Pusher/Ably for WebSocket → Adds complexity and cost
- Use external audio processing API → None exist for this use case
- **Verdict**: Not viable

### 5.2 All-in-One on Railway/Render
- Deploy both frontend and backend together
- **Verdict**: Viable but loses Vercel's frontend optimization benefits

### 5.3 Vercel + AWS Lambda with Layers
- Custom Lambda layers for ffmpeg
- **Verdict**: More complex, still has size/timeout issues

---

## 6. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cross-origin issues | High | Proper CORS configuration |
| Cold starts on Railway | Medium | Use Pro plan or keep-alive pings |
| Railway costs | Low | Hobby tier sufficient for testing |
| WebSocket connectivity | Medium | Implement reconnection logic (already done) |

---

## 7. Cost Estimate

| Service | Plan | Cost/Month |
|---------|------|------------|
| Vercel | Hobby | $0 |
| Railway | Hobby | ~$5 (usage-based) |
| **Total** | | **~$5/month** |

---

## 8. Action Items

- [ ] Review and update `audio-service/Dockerfile`
- [ ] Update CORS settings in `audio-service/src/main.py`
- [ ] Create Railway account and deploy backend
- [ ] Create Vercel account and deploy frontend
- [ ] Configure environment variables on both platforms
- [ ] Test end-to-end flow in production

---

## Sources

- [Vercel Serverless Function Limits](https://vercel.com/docs/limits)
- [Vercel WebSocket FAQ](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections)
- [Deploy FastAPI on Railway](https://docs.railway.com/guides/fastapi)
- [Deploy FastAPI on Render](https://render.com/docs/deploy-fastapi)
- [FastAPI on Fly.io](https://fly.io/docs/python/frameworks/fastapi/)
- [Northflank: Vercel Backend Limitations](https://northflank.com/blog/vercel-backend-limitations)
