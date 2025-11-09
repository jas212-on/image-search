import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { axiosInstance } from '../lib/axios';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import TrendingSearches from '../components/TrendingSearches';
import SearchResults from '../components/SearchResults';
import ImageGrid from '../components/ImageGrid';
import EmptyState from '../components/EmptyState';

const ImageSearchApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [sampleImages, setSampleImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
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

  const loginWithFacebook = () => {
    window.location.href = "http://localhost:5000/auth/facebook";
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.get("/auth/logout");
      setIsLoggedIn(false);
      setUsername("");
      setSearchHistory([]);
      setSelectedImages(new Set());
      setCurrentSearch("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/auth/current-user");
        setUsername(res.data.name);
        setIsLoggedIn(true);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
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
    setIsLoadingImages(true);
    try {
      const res = await axiosInstance.get(`/api/unsplash/search?q=${query}`, {
        withCredentials: true
      });
      setSampleImages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingImages(false);
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
    const queryDisplay = query.charAt(0).toUpperCase() + query.slice(1);
    setSearchQuery(queryDisplay);
    searchImages(query);
  };

  const handleHistoryClick = (query) => {
    const queryDisplay = query.charAt(0).toUpperCase() + query.slice(1);
    setSearchQuery(queryDisplay);
    searchImages(query);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isLoggedIn={isLoggedIn}
        username={username}
        isLoading={isLoading}
        loginWithGoogle={loginWithGoogle}
        loginWithGithub={loginWithGithub}
        loginWithFacebook={loginWithFacebook}
        handleLogout={handleLogout}
        searchHistory={searchHistory}
        handleHistoryClick={handleHistoryClick}
      />

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      <div className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-30"
          >
            <Menu size={24} />
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ImageHub</h1>
            <p className="text-gray-600">Discover stunning visuals</p>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchImages={searchImages}
            isLoggedIn={isLoggedIn}
          />

          <TrendingSearches
            topSearches={topSearches}
            handleTopSearchClick={handleTopSearchClick}
          />

          {currentSearch && isLoggedIn && (
            <SearchResults
              currentSearch={currentSearch}
              imagesCount={sampleImages.length}
              selectedCount={selectedImages.size}
            />
          )}

          {currentSearch && isLoggedIn && (
            <ImageGrid
              images={sampleImages}
              selectedImages={selectedImages}
              toggleImageSelection={toggleImageSelection}
              isLoadingImages={isLoadingImages}
            />
          )}

          {(!currentSearch || !isLoggedIn) && (
            <EmptyState isLoggedIn={isLoggedIn} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSearchApp;