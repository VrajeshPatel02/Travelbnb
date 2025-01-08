import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Property } from "../types/property";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Heart } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (id: number) => void;
}

const PropertyCard = React.memo(
  ({ property, onToggleFavorite }: PropertyCardProps) => {
    const { id, name, imageUrl, noGuests, no_bedrooms, no_bathrooms, price, location, country, isFavorite } = property;

    return (
      <div className="group">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Carousel className="h-full">
            <CarouselContent>
              {imageUrl.map((image, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <div className="relative h-full w-full aspect-square">
                    <Image
                      src={image}
                      alt={`${name} - Image ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 opacity-0 transition-opacity group-hover:opacity-100" />
            <CarouselNext className="absolute right-2 opacity-0 transition-opacity group-hover:opacity-100" />
          </Carousel>
          {/* Toggle Favorite Button */}
          <button
            onClick={() => onToggleFavorite(id)}  // Call the function with the id of the property
            className="absolute right-3 top-3 rounded-full bg-white p-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Heart
              className={`h-5 w-5 text-neutral-500 ${isFavorite ? "fill-red-500 text-red-500"
                : "text-white fill-neutral-700 hover:fill-red-500 hover:text-red-500 hover:ease-in-out"}`}
            />
          </button>
        </div>
        <Link href={`/property/${id}`} className="mt-3 block space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900 line-clamp-1">{location}, {country}</h3>
            <div className="flex items-center space-x-1">
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="h-4 w-4 fill-current text-neutral-800"
              >
                <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" fillRule="evenodd"></path>
              </svg>
              <span className="text-sm font-semibold text-neutral-800">4.99</span>
            </div>
          </div>
          <p className="text-sm text-neutral-500">
            {no_bedrooms} bedroom{no_bedrooms > 1 ? 's' : ''} · {no_bathrooms} bathroom{no_bathrooms > 1 ? 's' : ''}
          </p>
          <p className="text-sm text-neutral-500">
            <span className="font-semibold text-neutral-900">₹{price.toLocaleString()}</span> per night
          </p>
        </Link>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.property.id === nextProps.property.id
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
