'use client';
import { Property } from "../types/property";
import Image from 'next/image';
interface PropertyCardProps {
  property: Property;
}
 
const PropertyCard = ({ property }: PropertyCardProps) => {
  // Add comprehensive logging and error checking
  console.log('Rendering Property Card:', property);

  // Validate required properties before rendering
  const isValidProperty = property && 
    property.name && 
    property.image_url && 
    property.price !== undefined;

  if (!isValidProperty) {
    console.error('Invalid property object:', property);
    return null; // Prevent rendering of invalid property
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Use Next.js Image component for better performance and optimization */}
      {property.image_url ? (
        <Image
          src={property.image_url}
          alt={property.name || 'Property Image'}
          width={400}
          height={200}
          className="h-48 w-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', property.image_url);
            e.currentTarget.style.display = 'none'; // Hide broken images
          }}
        />
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          No Image Available
        </div>
      )}
      
      <div className="p-4">
        <h2 className="text-xl text-neutral-600 font-semibold">
          {property.name || 'Unnamed Property'}
        </h2>
        <p className="text-sm text-gray-500">
          Guests: {property.noGuests || 'N/A'}
        </p>
        <p className="text-sm text-gray-500">
          {property.no_bedrooms || 0} Bedrooms • {property.no_bathrooms || 0} Bathrooms
        </p>
        <p className="text-lg text-neutral-600 font-bold mt-2">
          ₹{(property.price || 0).toLocaleString()}
        </p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
          View Details
        </button>
      </div>
    </div>
  );
};
 
export default PropertyCard;