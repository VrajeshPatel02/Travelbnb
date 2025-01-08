'use client';

import React, { useState, useEffect, useCallback } from "react";
import PropertyCard from "@/components/Cards";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";

const Dashboard = () => {
  const { properties, loadMoreProperties, toggleFavorite, hasMore, isLoading } = useProperties();
  const [searchResults, setSearchResults] = useState(properties);

  // Sync search results with fetched properties
  useEffect(() => {
    setSearchResults(properties);
  }, [properties]);

  // Handle search logic
  const handleSearch = useCallback((results: any[] | null) => {
    setSearchResults(results || properties);
  }, [properties]);

  // Reset search to show all properties
  const resetSearch = useCallback(() => {
    setSearchResults(properties);
  }, [properties]);

  // Determine which properties to display
  const displayProperties = searchResults || properties;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setSearchResults={handleSearch} resetSearch={resetSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Explore stays</h1>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {displayProperties.length === 0 && !isLoading && (
          <div className="text-center text-gray-500">No properties found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onToggleFavorite={() => toggleFavorite(property.id)}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMoreProperties}
              disabled={isLoading}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition duration-200"
            >
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
