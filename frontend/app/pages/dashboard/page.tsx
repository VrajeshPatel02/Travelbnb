'use client'
import PropertyCard from '@/app/components/Cards';
import Navbar from '@/app/components/Navbar';
import { Button } from '@/app/components/ui/button'
import api from '@/app/services/authService';
import { Property } from '@/app/types/property';
import React, { useEffect, useState } from 'react'

type Props = {}

const Dashboard = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]); 
  const [error, setError] = useState(""); 
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);
  const [pageNo, setPageNo] = useState(0);

  const property = async (page : number) => {
    setIsLoading(true);
    try {
      let response = await api.get(`/property/allProperties?pageNo=${page}&pageSize=1`);
      console.log("Response Data : " , response.data.content);
      setProperties((prevProperties) => [...prevProperties, ...response.data.content]);
    } catch (err : unknown) {
      console.error("Failed to fetch properties:", err);
      setError((err as Error).message || "Failed to load properties. Please try again.");
    } finally{
      setIsLoading(false);
    }
  };
// Initial fetch on component mount
  useEffect(()=>{
    property(pageNo)
  },[]);

  // Handle "Load More" button click
  const handleLoadMore = async () => {
    const nextPage = pageNo + 1;
  
    // Directly fetch data without waiting for pageNo to update
    await property(nextPage);
  
    // Update page number after fetching
    setPageNo(nextPage);
  
    console.log("Loaded page no:", nextPage);
  };

  // Determine which properties to display
  const displayProperties = searchResults || properties;

  console.log("Properties set : " , properties);
  // console.log("Page no :" , pageNo);

  return (
    <div className="min-h-screen bg-gray-100">
     {/* <Navbar setSearchResults={setSearchResults} />  */}
      
      <div className="pt-24 px-6">
        <h1 className="text-3xl font-bold m-6 text-center">Properties</h1>
        
        {/* Error Handling */}
        {error  && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        
        {/* Loading State */}
        {isLoading && properties.length === 0 && (
          <div className="text-center text-gray-500">Loading properties...</div>
        )}
        
        {/* Properties Grid */}
        {!isLoading && displayProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProperties.map((allproperty) => (
              <PropertyCard key={allproperty.id} property={allproperty} />
            ))}
          </div>
        ) : (
          !isLoading && <div className="text-center text-gray-500">No properties found.</div>
        )}
        
        {/* Load More Button */}
                <div className="flex justify-center mt-6">
            <Button 
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
      </div>
    </div>

  )
}

export default Dashboard