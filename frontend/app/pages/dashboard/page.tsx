'use client'
import PropertyCard from '@/app/components/Cards';
import Navbar from '@/app/components/Navbar';
import { Button } from '@/app/components/ui/button';
import api from '@/app/services/authService';
import { Property } from '@/app/types/property';
import React, { useEffect, useState, useCallback, useRef } from 'react'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);
  const [error, setError] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // Use ref to track mounted state
  const isMounted = useRef(false);

  const fetchProperties = useCallback(async (page: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await api.get(`/property/allProperties?pageNo=${page}&pageSize=3`);
      const newContent = response.data.content;
      
      // Update hasMore based on whether we received any new content
      if (newContent.length === 0) {
        setHasMore(false);
        return;
      }

      setProperties(prevProperties => {
        // Create a map of existing IDs for efficient lookup
        const existingIds = new Set(prevProperties.map(p => p.id));
        // Filter out any properties that already exist
        const uniqueNewProperties = newContent.filter(
          (prop: Property) => !existingIds.has(prop.id)
        );
        return [...prevProperties, ...uniqueNewProperties];
      });
    } catch (err: unknown) {
      console.error("Failed to fetch properties:", err);
      setError((err as Error).message || "Failed to load properties. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    // Only fetch on initial mount
    if (!isMounted.current) {
      isMounted.current = true;
      fetchProperties(0);
    }
  }, [fetchProperties]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = pageNo + 1;
      setPageNo(nextPage);
      fetchProperties(nextPage);
    }
  }, [pageNo, isLoading, hasMore, fetchProperties]);

  const handleSearch = useCallback((results: Property[] | null) => {
    setSearchResults(results);
    // Reset pagination when searching
    if (results !== null) {
      setPageNo(0);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setSearchResults(null);
  }, []);

  // Determine which properties to display
  const displayProperties = searchResults || properties;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        setSearchResults={handleSearch}
        resetSearch={resetSearch}
      />
      
      <div className="pt-24 px-6">
        <h1 className="text-3xl font-bold m-6 text-center">Properties</h1>
        
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        
        {isLoading && displayProperties.length === 0 && (
          <div className="text-center text-gray-500">Loading properties...</div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard 
              key={property.id}
              property={property} 
            />
          ))}
        </div>
        
        {/* Only show Load More if we're not showing search results and have more content */}
        {!searchResults && hasMore && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-4 py-2"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;