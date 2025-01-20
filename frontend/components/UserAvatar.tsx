"use client";

import { useState, useEffect } from "react";
import { Menu, User } from "lucide-react";
import {authService} from "@/services/authService";

const UserAvatar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if we are in the browser
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);

      if (authStatus) {
        const user = authService.getUser();
        setUserDetails(user);
      }
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(username)}`;
  };

  return (
    <div className="relative ml-3">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition duration-200"
      >
        <Menu className="w-5 h-5" />
        {isAuthenticated && userDetails ? (
          <img
            src={getAvatarUrl(userDetails.username)}
            alt="Avatar"
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <User className="w-7 h-7 text-gray-500" />
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          {isAuthenticated ? (
            <>
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a
                href="/bookings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Bookings
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Log in
              </a>
              <a
                href="/sign-up"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
