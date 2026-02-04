# Task 27: Deploy Frontend to Vercel

> **Phase**: 5 - Polish & Deploy
> **Complexity**: Small
> **Dependencies**: Tasks 01-06, 14-23, 26
> **Status**: Pending

## Description

Deploy the Next.js frontend to Vercel with proper environment configuration, connecting to the Railway-hosted audio service.

## Acceptance Criteria

- [ ] Frontend deploys successfully
- [ ] Environment variables configured
- [ ] Connected to Railway audio service
- [ ] Custom domain (optional)
- [ ] Analytics enabled
- [ ] Auto-redeploy on git push

## Implementation

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, max-age=0" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/ws/:path*",
      "destination": "${AUDIO_SERVICE_URL}/:path*"
    }
  ]
}
```

### Environment Variables

Create `.env.example`:

```env
# Audio Service
AUDIO_SERVICE_URL=https://your-audio-service.railway.app

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Production Environment Check

Update `src/lib/config.ts`:

```typescript
export const config = {
  audioServiceUrl: process.env.AUDIO_SERVICE_URL || 'http://localhost:8000',
  isProduction: process.env.NODE_ENV === 'production',
  websocketUrl: process.env.NEXT_PUBLIC_WS_URL || process.env.AUDIO_SERVICE_URL || 'http://localhost:8000',
};

// Validate required env vars in production
if (config.isProduction && !process.env.AUDIO_SERVICE_URL) {
  console.error('Missing required environment variable: AUDIO_SERVICE_URL');
}
```

### Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the repository containing the Next.js app

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   AUDIO_SERVICE_URL=https://your-audio-service.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Configure DNS as instructed

### Update Next.js Config

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Production Build Check

Add to `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "prebuild": "npm run typecheck && npm run lint"
  }
}
```

### Health Check Endpoint

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const audioServiceUrl = process.env.AUDIO_SERVICE_URL;

  let audioServiceStatus = 'unknown';
  try {
    const response = await fetch(`${audioServiceUrl}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    audioServiceStatus = response.ok ? 'healthy' : 'unhealthy';
  } catch {
    audioServiceStatus = 'unreachable';
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      audio: audioServiceStatus,
    },
  });
}
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `vercel.json` | Create |
| `.env.example` | Create |
| `src/lib/config.ts` | Create |
| `next.config.js` | Update |
| `package.json` | Update |
| `src/app/api/health/route.ts` | Create |

## Testing

- [ ] Build succeeds locally with `npm run build`
- [ ] Type checking passes
- [ ] Lint passes
- [ ] Production deployment works
- [ ] Health endpoint returns status
- [ ] Audio service connection works

## Post-Deployment

1. Note the Vercel URL (e.g., `https://neuro-acoustic.vercel.app`)
2. Update Railway's ALLOWED_ORIGINS to include this URL
3. Test the full flow: URL input → analysis → visualization

---

_Task 27 of 28 - neuro-acoustic-analyzer_
