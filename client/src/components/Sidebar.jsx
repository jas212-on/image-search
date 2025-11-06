import React from "react";
import { X, History, LogOut } from "lucide-react";
import LoginButtons from './LoginButtons';

export const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isLoggedIn,
  username,
  isLoading,
  loginWithGoogle,
  loginWithGithub,
  handleLogout,
  searchHistory,
  handleHistoryClick
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static border-r border-gray-200`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">ImageHub</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Login Section */}
        <div className="p-6 border-b border-gray-200">
          {!isLoggedIn ? (
            <LoginButtons
              loginWithGoogle={loginWithGoogle}
              loginWithGithub={loginWithGithub}
              isLoading={isLoading}
            />
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{username}</p>
                  <p className="text-sm text-gray-500">Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div>
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Search History */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-gray-600" />
            <h3 className="font-medium text-gray-800">Recent Searches</h3>
          </div>
          {!isLoggedIn ? (
            <p className="text-gray-500 text-sm">
              Sign in to track your search history
            </p>
          ) : searchHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Your searches will appear here
            </p>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((history) => (
                <button
                  key={history._id}
                  onClick={() => handleHistoryClick(history.term)}
                  className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-700 text-sm flex justify-between items-center"
                >
                  <span>{history.term}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(history.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;