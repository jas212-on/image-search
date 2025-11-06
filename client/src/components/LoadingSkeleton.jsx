import React from "react";

export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(12)].map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-64 w-full"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;