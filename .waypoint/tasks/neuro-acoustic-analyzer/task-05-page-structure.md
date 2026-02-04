# Task 05: Build Page Structure

> **Phase**: 1 - Foundation
> **Complexity**: Small
> **Dependencies**: Tasks 01, 04
> **Status**: Pending

## Description

Create the basic page structure with App Router. This includes the home page (URL input) and the dynamic analyze page route.

## Acceptance Criteria

- [ ] Home page with centered URL input
- [ ] Analyze page with dynamic `[videoId]` route
- [ ] Root layout with metadata
- [ ] Basic styling and responsive layout
- [ ] Navigation between pages

## Implementation

### Update Root Layout

`src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neuro-Acoustic Analyzer',
  description: 'See how music moves through your brain',
  keywords: ['music', 'brain', 'neuroscience', 'analysis', 'emotions'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                🧠 Neuro-Acoustic Analyzer
              </a>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t border-gray-200 dark:border-gray-800 py-4">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
              <p>For educational purposes only. Brain predictions based on audio analysis.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
```

### Create Home Page

`src/app/page.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { URLInput } from '@/components/url-input';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string, videoId: string) => {
    setIsLoading(true);
    // Navigate to analyze page
    router.push(`/analyze/${videoId}?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          See How Music Moves Through Your Brain
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Analyze any YouTube song to visualize brain activation patterns,
          emotional responses, and brainwave states.
        </p>

        <div className="flex justify-center mb-8">
          <URLInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <FeatureCard
            icon="🧠"
            title="Brain Regions"
            description="See which parts of your brain light up with the music"
          />
          <FeatureCard
            icon="📊"
            title="Brainwaves"
            description="Track Alpha, Beta, Theta, and Gamma wave predictions"
          />
          <FeatureCard
            icon="🎭"
            title="Emotions"
            description="Understand the emotional impact of each section"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </div>
  );
}
```

### Create Analyze Page (Placeholder)

`src/app/analyze/[videoId]/page.tsx`:

```typescript
'use client';

import { useParams, useSearchParams } from 'next/navigation';

export default function AnalyzePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const videoId = params.videoId as string;
  const url = searchParams.get('url');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Analyzing Video
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            Video ID: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{videoId}</code>
          </p>
          {url && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              URL: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">{url}</code>
            </p>
          )}

          <div className="mt-8 text-center text-gray-500">
            <p>Analysis components will be added here...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Create Loading State

`src/app/analyze/[videoId]/loading.tsx`:

```typescript
export default function AnalyzeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/layout.tsx` | Modify |
| `src/app/page.tsx` | Modify |
| `src/app/analyze/[videoId]/page.tsx` | Create |
| `src/app/analyze/[videoId]/loading.tsx` | Create |

## Testing

- [ ] Home page loads at `/`
- [ ] URL input works and navigates to `/analyze/[videoId]`
- [ ] Analyze page shows video ID from URL
- [ ] Loading state appears during navigation
- [ ] Responsive layout works on mobile

## Notes

- Using dynamic route `[videoId]` for clean URLs
- Pass full URL as query param for backend use
- Placeholder content will be replaced in later tasks

---

_Task 05 of 28 - neuro-acoustic-analyzer_
