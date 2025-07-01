
export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-24"></div>
        ))}
      </div>
    </div>
  );
};
