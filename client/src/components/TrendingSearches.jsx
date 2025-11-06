import React from "react";

export const TrendingSearches = ({ topSearches, handleTopSearchClick }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Trending Searches
      </h2>
      <div className="flex flex-wrap gap-3">
        {topSearches.map((search, idx) => (
          <button
            key={idx + 1}
            onClick={() => handleTopSearchClick(search._id)}
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition"
          >
            {search._id.charAt(0).toUpperCase() + search._id.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearches;