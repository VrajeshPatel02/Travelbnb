import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

const PropertyCard = React.memo(
  ({ property, onEdit, onDelete }: PropertyCardProps) => {
    const { imageUrls = [], name, location, country, id } = property; // Ensure `imageUrls` has a fallback array
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleDelete = () => {
      onDelete?.(property);
      setShowDeleteAlert(false);
    };

    return (
      <>
        <Card className="w-full max-w-md group">
          <div className="relative">
            {/* Property Image */}
            <CardHeader className="p-0">
              <div className="relative h-full w-full aspect-square">
                <Image
                  src={imageUrls[0]?.imageUrl || "/placeholder.svg"} // Add a safe fallback
                  alt={`${name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={true}
                />
              </div>
            </CardHeader>

            {/* Property Details */}
            <Link href={`/host/propertyDetails/${id}`}>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-medium">{name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {location}, {country}
                </CardDescription>
              </CardContent>
            </Link>
          </div>
        </Card>
      </>
    );
  },
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps.property) === JSON.stringify(nextProps.property);
  }
);

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
