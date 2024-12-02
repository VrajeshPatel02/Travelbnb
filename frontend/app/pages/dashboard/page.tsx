"use client";

import PropertyCard from "@/app/components/Cards";
import Navbar from "@/app/components/Navbar";
import api from "@/app/services/authService";
import { Property } from "@/app/types/property";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination"


const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);
  const [error, setError] = useState<string>("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get<Property[]>("/property/allProperties");
        setProperties(response.data);
        console.log(properties);
      } catch (err: unknown) {
        console.error("Failed to fetch properties:", err);
        setError((err as Error).message);
      }
    };

    fetchProperties();
  }, [API_URL]);

  return (<>
    <div className="min-h-screen bg-gray-100">
      {/* Pass setSearchResults to Navbar */}
      <Navbar setSearchResults={setSearchResults} />

      <div className="pt-24 px-6">
        <h1 className="text-3xl font-bold m-6 text-center">Properties</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (searchResults || properties).length > 0 ? (
            (searchResults || properties).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <p className="text-gray-500 text-center">No properties found.</p>
          )}
        </div>
      </div>
      <Pagination className="p-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
    

  </>
  );
};

export default Dashboard; 