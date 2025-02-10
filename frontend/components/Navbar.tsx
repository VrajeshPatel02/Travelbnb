"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Menu, User } from 'lucide-react';
import api, { authService } from "../services/authService";
import UserAvatar from "./UserAvatar";

interface NavbarProps {
    setSearchResults: (results: any[] | null) => void;
    resetSearch: () => void;
}

const Navbar = ({ setSearchResults, resetSearch }: NavbarProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hostingButton, useHostingButton] = useState('Host your home')

    useEffect(() => {
        const fetchUserDetails = () => {
            if (authService.isAuthenticated()) {
                const details = authService.getUser();
                if (details?.role === 'ROLE_ADMIN') { useHostingButton('Switch to hosting') };
    
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
                        <a href="/host" className="hidden md:block text-sm font-semibold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full">
                            {hostingButton}
                        </a>
                        <button className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
                            <Globe className="w-5 h-5" />
                        </button>
                        <UserAvatar/>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;  