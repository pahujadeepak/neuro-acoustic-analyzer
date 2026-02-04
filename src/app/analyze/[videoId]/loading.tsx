export default function AnalyzeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="h-4 bg-gray-800 rounded w-64 mb-4"></div>
            <div className="aspect-video bg-gray-800 rounded-lg"></div>
            <div className="mt-8 flex justify-center">
              <div className="h-10 bg-gray-800 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
