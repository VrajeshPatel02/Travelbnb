import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ImageUrl, Property } from '@/types/property';
import Image from 'next/image'
interface PropertyCard {
  property: Property;
}
const PropertyCard = React.memo(
  ({property}:PropertyCard) => {
  const { imageUrls, name, location, country } = property;
  
  return (
    <Card className="w-full max-w-md">
      <div className="relative">
        {/* Status Badge */}
        {/* <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-full flex items-center">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
          <span className="text-sm">In progress</span>
        </div> */}

        {/* Property Image */}
        <CardHeader className="p-0">
          <div className="relative h-full w-full aspect-square">
            <Image
              src={imageUrls[0].imageUrl}
              alt={`${name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </CardHeader>

        {/* Property Details */}
        <CardContent className="p-4">
          <CardTitle className="text-lg font-medium">{name}</CardTitle>
          <CardDescription className="text-gray-600">{location},{country}</CardDescription>
        </CardContent>
      </div>
    </Card>
  );
},(prevProps, nextProps) => {
  return JSON.stringify(prevProps.property) === JSON.stringify(nextProps.property);
}
);

export default PropertyCard;