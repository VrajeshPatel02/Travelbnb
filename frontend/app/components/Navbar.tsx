"use client"; // Add this at the top of the file

import { useState, useEffect } from "react";
import api from "@/app/services/authService";
import { authService } from "@/app/services/authService";


interface NavbarProps {
  setSearchResults: (results: any[]) => void;
}

const Navbar = ({ setSearchResults }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Check if token exists for authentication status
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchAllProperties(); // Fetch all properties when search bar is cleared
    }
  }, [searchQuery]);

  const fetchAllProperties = async () => {
    setIsLoading(true);

    try {
      const response = await api.get("/property/allProperties");
      setSearchResults(response.data); // Pass all properties to Dashboard
    } catch (error: unknown) {
      console.error("Error fetching all properties:", (error as any).response?.data || (error as Error).message);
      alert("Failed to fetch properties. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.get(`/property/search/properties?name=${searchQuery}`);
      setSearchResults(response.data); // Pass results to Dashboard
    } catch (error) {
      console.error("Error fetching search results:", (error as any).response?.data || (error as Error).message);
      alert("Failed to fetch search results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout(); // Call authentication service to log out user
    window.location.href = "/pages/login"; // Redirect to login page
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search on Enter key press
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-lg border border-gray-100 bg-white/80 py-3 shadow-md backdrop-blur-lg md:top-6 md:rounded-3xl">
      <div className="flex items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src="airbnb-logo.svg" alt="Logo" className="h-8 w-auto" />
          <span className="sr-only">Website Title</span>
        </a>

        {/* Search Bar */}
        <label
          htmlFor="search-bar"
          className="md:flex mx-8 flex-1 relative bg-white items-center border border-gray-300 py-2 px-4 rounded-2xl gap-2 shadow-md focus-within:ring-2 focus-within:ring-gray-300"
        >
          <input
            id="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for keydown events
            placeholder="Search properties"
            className="w-full bg-transparent outline-none px-4 text-gray-800"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-black border border-black text-white active:scale-95 duration-150 rounded-xl transition-all disabled:opacity-70"
          >
            Search
          </button>
        </label>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-red-500"
            >
              Logout
            </button>
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
      </div>
    </header>
  );
};

export default Navbar;
