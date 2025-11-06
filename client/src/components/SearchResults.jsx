import React from "react";

export const SearchResults = ({ currentSearch, imagesCount, selectedCount }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Showing {imagesCount} results for "{currentSearch}"
      </h2>
      <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
        <span className="font-medium">
          Selected: {selectedCount} of {imagesCount}
        </span>
      </div>
    </div>
  );
};

export default SearchResults;