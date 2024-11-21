import { authService } from "../services/authService";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    window.location.href = "/pages/login";
  };

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Search completed");
    }, 2000);
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
            placeholder="Your keyword here"
            className="w-full bg-transparent outline-none px-4 text-gray-800"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-black border border-black text-white active:scale-95 duration-150 rounded-xl transition-all disabled:opacity-70"
          >
            <div className="relative flex items-center justify-center">
              {/* Loading Animation */}
              <div
                className={`flex items-center justify-center h-4 w-4 absolute inset-0 transition-all ${
                  isLoading ? "opacity-100 animate-spin" : "opacity-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>

              {/* Button Text */}
              <div
                className={`transition-opacity ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="text-sm font-semibold truncate whitespace-nowrap">
                  Search
                </span>
              </div>
            </div>
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
