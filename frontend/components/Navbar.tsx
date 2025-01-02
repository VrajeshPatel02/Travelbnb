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
        <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-lg border border-gray-100 bg-white/80 py-4 shadow-lg backdrop-blur-lg md:top-6 md:rounded-3xl">
            <div className="flex items-center justify-between px-6">
                <a href="/" className="flex items-center">
                    <img src="/airbnb-logo.svg" alt="Logo" className="h-8 w-auto" />
                    <span className="sr-only">Website Title</span>
                </a>

                <label className="relative flex-1 mx-6 flex items-center bg-white border border-gray-300 py-2 px-4 rounded-full shadow-md focus-within:ring-2 focus-within:ring-gray-300">
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
                        className="ml-2 px-6 py-2 bg-black border border-black text-white active:scale-95 duration-150 rounded-full transition-all disabled:opacity-70"
                    >
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                </label>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="relative dropdown-container group">
                            <div className="relative inline-flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                <img
                                    src={getAvatarUrl(userDetails?.username || "")}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Dropdown menu shown on hover */}
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300">
                                <div className="text-center">
                                    <h1 className="text-lg font-bold">{userDetails?.username}</h1>
                                    <p className="text-gray-600">{userDetails?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
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
