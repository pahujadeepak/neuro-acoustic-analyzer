# Task 04: Build URLInput Component

> **Phase**: 1 - Foundation
> **Complexity**: Medium
> **Dependencies**: Task 01
> **Status**: Pending

## Description

Create a reusable URLInput component that accepts YouTube URLs, validates them client-side, and provides visual feedback. This is the primary entry point for user interaction.

## Acceptance Criteria

- [ ] Input field styled with Tailwind
- [ ] Accepts youtube.com and youtu.be URLs
- [ ] Shows inline validation error for invalid URLs
- [ ] Submit button disabled when invalid/empty
- [ ] Loading state during submission
- [ ] Extracts video ID from URL
- [ ] Accessible (labels, focus states)

## Implementation

### Create YouTube URL Parser

`src/lib/youtube/url-parser.ts`:

```typescript
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractVideoId(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url);
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
```

### Create URLInput Component

`src/components/url-input.tsx`:

```typescript
'use client';

import { useState, useCallback } from 'react';
import { isValidYouTubeUrl, extractVideoId } from '@/lib/youtube/url-parser';

interface URLInputProps {
  onSubmit: (url: string, videoId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function URLInput({ onSubmit, isLoading = false, disabled = false }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError('Please enter a YouTube URL');
      return false;
    }
    if (!isValidYouTubeUrl(value)) {
      setError('Please enter a valid YouTube URL');
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (touched) {
      validate(value);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validate(url)) return;

    const videoId = extractVideoId(url);
    if (videoId) {
      onSubmit(url, videoId);
    }
  };

  const isValid = url.trim() && isValidYouTubeUrl(url);
  const showError = touched && error;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <label htmlFor="youtube-url" className="sr-only">
          YouTube URL
        </label>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              id="youtube-url"
              type="url"
              value={url}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Paste YouTube URL here..."
              disabled={disabled || isLoading}
              className={`
                w-full px-4 py-3 rounded-lg border-2
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder-gray-400
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${showError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                }
              `}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading || disabled}
            className={`
              px-6 py-3 rounded-lg font-medium
              transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isValid && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500'
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {showError && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports youtube.com and youtu.be links
        </p>
      </div>
    </form>
  );
}
```

### Create Index Export

`src/lib/youtube/index.ts`:

```typescript
export * from './url-parser';
```

## Files to Create

| File | Description |
|------|-------------|
| `src/lib/youtube/url-parser.ts` | URL parsing utilities |
| `src/lib/youtube/index.ts` | Barrel export |
| `src/components/url-input.tsx` | URLInput component |

## Testing

- [ ] Component renders without errors
- [ ] Valid YouTube URLs enable submit button
- [ ] Invalid URLs show error message
- [ ] Loading state shows spinner
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces error messages

### Test Cases

```
Valid URLs:
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
- https://youtube.com/watch?v=dQw4w9WgXcQ
- https://youtu.be/dQw4w9WgXcQ
- https://www.youtube.com/embed/dQw4w9WgXcQ

Invalid URLs:
- https://vimeo.com/123456
- not a url
- https://youtube.com (no video ID)
```

## Notes

- Use `'use client'` directive for client-side interactivity
- Keep validation logic in separate file for reuse
- Support both URL formats (youtube.com and youtu.be)

---

_Task 04 of 28 - neuro-acoustic-analyzer_
