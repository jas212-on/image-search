import React from "react";
import { Search } from "lucide-react";

export const EmptyState = ({ isLoggedIn }) => {
  return (
    <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
      <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
        <Search size={48} className="text-gray-400" />
      </div>
      <p className="text-xl text-gray-800 font-medium">
        {isLoggedIn ? "Start searching" : "Sign in to start searching"}
      </p>
      <p className="text-gray-500 mt-1">Enter a query to find images</p>
    </div>
  );
};

export default EmptyState;