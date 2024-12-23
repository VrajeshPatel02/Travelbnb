"use client";

import { useState, useEffect } from "react";
import api, { authService } from "../services/authService";

interface NavbarProps {
  setSearchResults: (results: any[] | null) => void;
  resetSearch: () => void;
}

const Navbar = ({ setSearchResults, resetSearch }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState<{ username: string; email: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUserDetails = () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
        const details = authService.getUser();
        setUserDetails(details);
      } else {
        setIsAuthenticated(false);
        setUserDetails(null);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      resetSearch();
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.get(`/property/search/properties?name=${trimmedQuery}`);
      setSearchResults(response.data);
    } catch (error: any) {
      console.error("Error fetching search results:", error.response?.data || error.message);
      alert("Failed to fetch search results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      resetSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserDetails(null);
    window.location.href = "/pages/login";
  };

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(username)}`;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-lg border border-gray-100 bg-white/80 py-3 shadow-md backdrop-blur-lg md:top-6 md:rounded-3xl">
      <div className="flex items-center justify-between px-4">
        <a href="/" className="flex items-center">
          <img src="/airbnb-logo.svg" alt="Logo" className="h-8 w-auto" />
          <span className="sr-only">Website Title</span>
        </a>

        <label className="flex-1 relative flex items-center bg-white border border-gray-300 py-2 px-4 rounded-2xl shadow-md focus-within:ring-2 focus-within:ring-gray-300">
          <input
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search properties"
            className="w-full bg-transparent outline-none px-4 text-gray-800"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="ml-2 px-6 py-3 bg-black border border-black text-white active:scale-95 duration-150 rounded-xl transition-all disabled:opacity-70"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </label>

        {isAuthenticated ? (
          <>
            {userDetails && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="relative inline-flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full overflow-hidden"
                >
                  <img
                    src={getAvatarUrl(userDetails.username)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-800">
                        Username: {userDetails.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {userDetails.email}
                      </p>
                    </div>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={() => setShowDropdown(false)}
                        className="w-full text-center text-sm py-2 hover:bg-gray-100"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a
              href="/pages/sign-up"
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-150 hover:bg-gray-100"
            >
              Sign Up
            </a>
            <a
              href="/pages/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-blue-500"
            >
              Login
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
