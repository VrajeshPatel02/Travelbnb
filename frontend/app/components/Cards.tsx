import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Property } from "../types/property";

interface PropertyCardProps {
  property: Property;
}

// Use React.memo with a simple comparison
const PropertyCard = React.memo(({ property }: PropertyCardProps) => {
  const {
    id,
    image_url,
    name,
    noGuests,
    no_bedrooms,
    no_bathrooms,
    price
  } = property;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          className="object-cover"
          src={image_url}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          priority={false}
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl text-neutral-600 font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">Guests: {noGuests}</p>
        <p className="text-sm text-gray-500">
          {no_bedrooms} Bedrooms • {no_bathrooms} Bathrooms
        </p>
        <p className="text-lg text-neutral-600 font-bold mt-2">
          ₹{price.toLocaleString()}
        </p>
        <Link 
          href={`/property/${id}`}
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Simple comparison of IDs since we know each property is unique
  return prevProps.property.id === nextProps.property.id;
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;