"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/services/authService";
import { Property } from "@/app/types/property";

const PropertyDetails = () => {
  const { id } = useParams(); // Fetch property ID from the URL
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await api.get<Property>(`/property/${id}`);
        setProperty(response.data);
      } catch (err: unknown) {
        console.error("Failed to fetch property details:", err);
        setError((err as Error).message);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!property) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={property.image_url}
          alt={property.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">{property.name}</h1>
          <p className="text-gray-600 mb-2">Guests: {property.noGuests}</p>
          <p className="text-gray-600 mb-2">
            {property.no_bedrooms} Bedrooms • {property.no_bathrooms} Bathrooms
          </p>
          <p className="text-lg font-bold text-neutral-600 mb-4">
            ₹{property.price.toLocaleString()}
          </p>
          <p className="text-gray-500 mb-4">{property.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;