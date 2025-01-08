'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import PropertyCard from '@/components/Cards';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import api from '@/services/authService';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types/property';
import { Filter } from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);
  const [error, setError] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const isMounted = useRef(false);

  const fetchProperties = useCallback(async (page: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await propertyService.getAllProperties(page);
      console.log(response);
      
      if (response.length === 0) {
        setHasMore(false);
        return;
      }

      setProperties(prevProperties => {
        const existingIds = new Set(prevProperties.map(p => p.id));
        const uniqueNewProperties = response.filter(
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
    if (results !== null) {
      setPageNo(0);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setSearchResults(null);
  }, []);

  const displayProperties = searchResults || properties;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        setSearchResults={handleSearch}
        resetSearch={resetSearch}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Explore stays</h1>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        
        {isLoading && displayProperties.length === 0 && (
          <div className="text-center text-gray-500">Loading properties...</div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard 
              key={property.id}
              property={property} 
            />
          ))}
        </div>
        
        {!searchResults && hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition duration-200"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

