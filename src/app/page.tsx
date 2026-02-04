'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { URLInput } from '@/components/url-input';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (url: string, videoId: string) => {
    setIsLoading(true);
    router.push(`/analyze/${videoId}?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
          See How Music Moves Through Your Brain
        </h1>

        <p className="text-lg text-gray-400 mb-8">
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
            description="Track Alpha, Beta, Theta, Delta, and Gamma wave predictions"
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
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-sm">
        {description}
      </p>
    </div>
  );
}
