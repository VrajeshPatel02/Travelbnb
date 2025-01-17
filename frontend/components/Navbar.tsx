"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Menu, User } from 'lucide-react';
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
    const [hostingButton, useHostingButton] = useState('Airbnb your home')

    useEffect(() => {
        const fetchUserDetails = () => {
            if (authService.isAuthenticated()) {
                setIsAuthenticated(true);
                const details = authService.getUser();
                if (details?.role === 'ROLE_ADMIN') {useHostingButton('Switch to hosting')};
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
        window.location.href = "/login";
    };

    const getAvatarUrl = (username: string) => {
        return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(username)}`;
    };

    return (
        <header className="fixed inset-x-0 top-0 z-30 w-full bg-white border-b border-gray-200">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center">
                            <img src="/airbnb-logo.svg" alt="Logo" className="h-8 w-auto" />
                        </a>
                    </div>

                    <div className="hidden md:block flex-1 max-w-md mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Start your search"
                                className="w-full py-2 pl-4 pr-12 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 text-white bg-rose-500 rounded-full hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <a href="/host/addProperty" className="hidden md:block text-sm font-semibold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full">
                        {hostingButton}
                        </a>
                        <button className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
                            <Globe className="w-5 h-5" />
                        </button>
                        <div className="relative ml-3">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition duration-200"
                            >
                                <Menu className="w-5 h-5" />
                                {isAuthenticated ? (
                                    <img
                                        src={getAvatarUrl(userDetails?.username || "")}
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
                                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                                            <a href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bookings</a>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                        </>
                                    ) : (
                                        <>
                                            <a href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log in</a>
                                            <a href="/sign-up" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign up</a>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

