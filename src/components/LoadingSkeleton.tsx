
export const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
            <div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse w-40 mb-2" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-56" />
            </div>
          </div>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse w-20" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
