export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Neuro-Acoustic Analyzer
        </h1>
        <p className="text-xl text-gray-400">
          Discover how music affects your brain. Analyze any YouTube video to visualize
          brain region activation, brainwave states, and emotional responses in real-time.
        </p>
        <div className="pt-4">
          <p className="text-gray-500">
            Coming soon: Paste a YouTube URL to begin analysis
          </p>
        </div>
      </div>
    </main>
  );
}
