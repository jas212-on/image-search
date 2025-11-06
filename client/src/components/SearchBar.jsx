import React from "react";
import { Search } from "lucide-react";

export const SearchBar = ({ searchQuery, setSearchQuery, searchImages, isLoggedIn }) => {
  return (
    <div className="max-w-2xl mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && isLoggedIn && searchImages(searchQuery)}
          placeholder={isLoggedIn ? "Search for images..." : "Please sign in to search"}
          disabled={!isLoggedIn}
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
        />
        <button
          onClick={() => searchImages(searchQuery)}
          disabled={!isLoggedIn}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Search size={20} />
        </button>
      </div>
      {!isLoggedIn && (
        <p className="text-sm text-gray-500 mt-2">Sign in to start searching for images</p>
      )}
    </div>
  );
};

export default SearchBar;