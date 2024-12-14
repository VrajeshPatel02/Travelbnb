"use client";

import PropertyCard from "@/app/components/Cards";
import Navbar from "@/app/components/Navbar";
import api from "@/app/services/authService";
import { Property } from "@/app/types/property";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch all properties on the initial render
  useEffect(() => {
    const fetchAllProperties = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<{ data: Property[] }>("/property/allProperties");
        const fetchedProperties = response.data?.data || [];
        setProperties(fetchedProperties);
      } catch (err: unknown) {
        console.error("Failed to fetch properties:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  const displayProperties = searchResults || properties;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setSearchResults={setSearchResults} />
      <div className="pt-24 px-6">
        <h1 className="text-3xl font-bold m-6 text-center">Properties</h1>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {isLoading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : displayProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;