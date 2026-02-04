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
        <h1 className="text-2xl font-bold text-white mb-4">
          Analyzing Video
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-300">
            Video ID: <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">{videoId}</code>
          </p>
          {url && (
            <p className="text-gray-300 mt-2">
              URL: <code className="bg-gray-800 px-2 py-1 rounded text-sm text-gray-400">{url}</code>
            </p>
          )}

          {/* Video embed placeholder */}
          <div className="mt-6 aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mt-8 text-center text-gray-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
              <svg className="animate-spin h-5 w-5 text-cyan-400" viewBox="0 0 24 24">
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
              <span>Analysis components coming soon...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
