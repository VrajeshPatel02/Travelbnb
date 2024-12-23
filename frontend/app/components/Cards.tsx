"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Property } from "../types/property";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = React.memo(
  ({ property }: PropertyCardProps) => {
    const { id, image_url, name, noGuests, no_bedrooms, no_bathrooms, price } = property;

    return (
      <Link
        href={`/property/${id}`}
        className="block bg-white rounded-lg overflow-hidden shadow-2xl hover:shadow-lg transition-shadow duration-200"
      >
        {/* Property Image */}
        <div className="relative h-48">
          <Image
            className="object-cover object-center"
            src={image_url}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>

        {/* Property Details */}
        <div className="p-6">
          {/* Badge and Meta Info */}
          <div className="flex items-baseline">
            {/* <span className="inline-block bg-teal-200 text-teal-800 py-1 px-3 text-xs rounded-full uppercase font-semibold tracking-wide">
              
            </span> */}
            <div className="ml-2 text-gray-600 text-xs uppercase font-semibold tracking-wide">
              {no_bedrooms} beds &bull; {no_bathrooms} baths
            </div>
          </div>

          {/* Property Name */}
          <h4 className="mt-2 font-semibold text-lg leading-tight truncate">
            {name}
          </h4>

          {/* Price */}
          <div className="mt-1">
            <span className="text-neutral-600 font-bold text-lg">
              ₹{price.toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm"> / night</span>
          </div>
        </div>
      </Link>
    );
  },
  (prevProps, nextProps) => prevProps.property.id === nextProps.property.id
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
