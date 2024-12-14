import Link from "next/link";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        className="h-48 w-full object-cover"
        src={property.image_url}
        alt={property.name}
      />
      <div className="p-4">
        <h2 className="text-xl text-neutral-600 font-semibold">{property.name}</h2>
        <p className="text-sm text-gray-500">Guests: {property.noGuests}</p>
        <p className="text-sm text-gray-500">
          {property.no_bedrooms} Bedrooms • {property.no_bathrooms} Bathrooms
        </p>
        <p className="text-lg text-neutral-600 font-bold mt-2">
          ₹{property.price.toLocaleString()}
        </p>
        {/* Add Link to navigate to the details page */}
        <Link href={`/property/${property.id}`}>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
