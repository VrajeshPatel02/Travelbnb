import { authService } from "../services/authService";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    // Optionally, refresh the page or redirect to login
    window.location.href = "/pages/login";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-lg border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl">
      <div className="px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex shrink-0">
          <a aria-current="page" className="flex items-center" href="/">
            <img
              className="h-7 w-auto"
              src="airbnb-logo.svg"
              alt="Logo"
            />
            <p className="sr-only">Website Title</p>
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8">
          <label
            className="relative bg-white w-full flex items-center border py-2 px-2 rounded-2xl shadow-2xl focus-within:border-gray-300 opacity-20 text-black"
            htmlFor="search-bar"
          >
            <input
              id="search-bar"
              placeholder="Your keyword here"
              className="px-6 py-2 w-full rounded-md outline-none bg-white"
            />
            <button
              className="px-6 py-3 bg-black border-black text-white rounded-xl transition-all duration-150"
              type="button"
            >
              Search
            </button>
          </label>
        </div>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              <a
                className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                href="/pages/sign-up"
              >
                Sign Up
              </a>
              <a
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500"
                href="/pages/login"
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
