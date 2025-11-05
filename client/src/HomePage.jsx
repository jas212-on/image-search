import React, { useState, useEffect } from "react";
import { Search, User, History, LogOut, Menu, X } from "lucide-react";
import { axiosInstance } from './lib/axios';

const ImageSearchApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [sampleImages,setSampleImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loginInput, setLoginInput] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topSearches, setTopSearches] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);


  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const loginWithGithub = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleLogout = async () => {
  try {
    setIsLoading(true);
    const res = await axiosInstance.get("/auth/logout");
    setIsLoggedIn(false);
    setUsername("");
    setSearchHistory([]);
    setSelectedImages(new Set());
    setCurrentSearch("");
  } catch (err) {
    console.error(err.response?.data || err.message);
  }finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/auth/current-user"); 
        setUsername(res.data.name);
        setIsLoggedIn(true)
      } catch (err) {
        console.error(err.response?.data || err.message);
      }finally {
        setIsLoading(false);
      }
    };

    const fetchTopSearches = async () => {
    try {
      const res = await axiosInstance.get("/api/unsplash/top-searches");
      setTopSearches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

    fetchTopSearches();
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const res = await axiosInstance.get("/api/unsplash/history");
        setSearchHistory(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchSearchHistory();
  }, [sampleImages]);

  const searchImages = async (query) => {
    if (!query) return;
    setCurrentSearch(query);
    setSelectedImages(new Set());
    setIsLoadingImages(true)
    try {
      const res = await axiosInstance.get(`/api/unsplash/search?q=${query}`, {
        withCredentials: true
      });
      setSampleImages(res.data);
    } catch (err) {
      console.error(err);
    } finally{
      setIsLoadingImages(false)
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const handleTopSearchClick = (query) => {
    const query_display = query.charAt(0).toUpperCase() + query.slice(1)
    setSearchQuery(query_display);
    searchImages(query);
  };

  const handleHistoryClick = (query) => {
    const query_display = query.charAt(0).toUpperCase() + query.slice(1)
    setSearchQuery(query_display);
    searchImages(query);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
              <div>
                <h3 className="font-medium text-gray-800 mb-4 text-center">
                  Continue with
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={loginWithGoogle}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleLogin('Facebook')}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </>
                    )}
                  </button>

                  <button
                    onClick={loginWithGithub}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="#181717" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </>
                    )}
                  </button>
                </div>
              </div>
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

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-30"
          >
            <Menu size={24} />
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ImageHub</h1>
            <p className="text-gray-600">Discover stunning visuals</p>
          </div>

          {/* Search Bar */}
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

          {/* Top Searches */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trending Searches
              </h2>
              <div className="flex flex-wrap gap-3">
                {topSearches.map((search,idx) => (
                  <button
                    key={idx+1}
                    onClick={() => handleTopSearchClick(search._id)}
                    className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition"
                  >
                    {search._id.charAt(0).toUpperCase() + search._id.slice(1)}
                  </button>
                ))}
              </div>
            </div>
   

          {/* Search Results Info */}
          {currentSearch && isLoggedIn && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Showing {sampleImages.length} results for "{currentSearch}"
              </h2>
              <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                <span className="font-medium">
                  Selected: {selectedImages.size} of {sampleImages.length}
                </span>
              </div>
            </div>
          )}

          {/* Image Grid */}
          {currentSearch && isLoggedIn && (
            <>
              {isLoadingImages ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, idx) => (
                    <div key={idx} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-64 w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sampleImages.map((image,idx) => (
                <div
                  key={image.id+idx}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg transition border border-gray-200"
                  onClick={() => toggleImageSelection(image.id)}
                >
                  <img
                    src={image.urls.regular}
                    alt={image.description}
                    className="w-full h-64 object-cover"
                  />

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 transition ${
                      selectedImages.has(image.id)
                        
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                          selectedImages.has(image.id)
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {selectedImages.has(image.id) && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
                    <p className="text-white font-medium">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
              )}
            </>
            
          )}

          {/* No Search State */}
          {(!currentSearch || !isLoggedIn) && (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Search size={48} className="text-gray-400" />
              </div>
              <p className="text-xl text-gray-800 font-medium">
                {isLoggedIn ? "Start searching" : "Sign in to start searching"}
              </p>
              <p className="text-gray-500 mt-1">Enter a query to find images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSearchApp;
