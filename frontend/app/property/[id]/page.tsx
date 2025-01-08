"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/authService";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/Input";

const PropertyDetails = () => {
  const { id } = useParams(); // Fetch property ID from the URL
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);

  const [guestCount, setGuestCount] = useState(1);
  const [nights, setNights] = useState(1);

  // Handlers for Guests
  const increaseGuestCount = () => setGuestCount((prev) => prev + 1);
  const decreaseGuestCount = () => {
    if (guestCount > 1) {
      setGuestCount((prev) => prev - 1);
    }
  };

  // Handlers for Nights
  const increaseNights = () => setNights((prev) => prev + 1);
  const decreaseNights = () => {
    if (nights > 1) {
      setNights((prev) => prev - 1);
    }
  };


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

    fetchPropertyDetails();
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!property) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] mb-8">
            <div className="col-span-2 row-span-2 relative">
              <img
                src={property.imageUrl[0]}
                alt="Main property view"
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src={property.imageUrl[1]}
                alt="Property detail 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src={property.imageUrl[2]}
                alt="Property detail 2"
                className="w-full h-full object-cover rounded-tr-lg"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src={property.imageUrl[3]}
                alt="Property detail 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1 relative">
              <img
                src={property.imageUrl[4]}
                alt="Property detail 4"
                className="w-full h-full object-cover rounded-br-lg"
              />
              <Button
                variant="secondary"
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-100"
              >
                Show all photos
              </Button>
            </div>
          </div>
          <div className="flex justify-center m-6">
            {/* Left Content Section */}
            <div className="w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-700 mb-4">
                {property.name}
              </h1>
              <p className="text-gray-600 mb-2">
                Guests: {property.noGuests}
              </p>
              <p className="text-gray-600 mb-2">
                {property.no_bedrooms} Bedrooms • {property.no_bathrooms} Bathrooms
              </p>
              <p className="text-gray-500">
                {property.description}
              </p>
            </div>

            {/* Right Card Section */}
            <div className="w-1/3 h-full">
      <div className="h-full relative">
        <div className="absolute inset-0">
          <div className="sticky top-4 w-full p-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-center mb-4">
                ₹{property.price.toLocaleString()} per night
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-full">
                    <Button variant="outline" className="w-full">
                      Guests
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-6 text-center">
                    {/* Guests Section */}
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">No. of Guests</h4>
                      <p className="text-sm text-muted-foreground">
                        Maximum allowed: {property.noGuests}
                      </p>
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Button
                          variant="outline"
                          className="h-8"
                          onClick={decreaseGuestCount}
                          disabled={guestCount <= 1}
                        >
                          -
                        </Button>
                        <Input
                          id="guestCount"
                          value={guestCount}
                          readOnly
                          className="text-center h-8"
                        />
                        <Button
                          variant="outline"
                          className="h-8"
                          onClick={increaseGuestCount}
                          disabled={guestCount >= property.noGuests}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    {/* Nights Section */}
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">No. of Nights</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the total number of nights.
                      </p>
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Button
                          variant="outline"
                          className="h-8"
                          onClick={decreaseNights}
                        >
                          -
                        </Button>
                        <Input
                          id="nightsCount"
                          value={nights}
                          readOnly
                          className="text-center h-8"
                        />
                        <Button
                          variant="outline"
                          className="h-8"
                          onClick={increaseNights}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="default" className="w-full mt-4">
                Book Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
          </div>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint illo voluptatem at quia similique repellendus nemo cumque, culpa debitis reprehenderit facere laudantium nobis autem tempora facilis minus impedit nulla. Eos!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores soluta excepturi architecto perspiciatis adipisci, iusto qui odio nam labore deserunt amet harum, unde alias sit voluptatem rem velit quod officia.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat delectus necessitatibus provident ratione, repellat rem quas? Optio quam laudantium ullam sunt aliquam ea asperiores obcaecati iste? Ullam sint a dolores!
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi necessitatibus molestias, sint fugit praesentium modi blanditiis beatae recusandae culpa, eaque animi cum, sed nemo nulla doloribus dicta. Assumenda, sit est.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis eius quo ab non neque omnis, obcaecati eum veritatis. Rerum esse quod eaque iusto quam inventore placeat consectetur cupiditate similique atque?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ullam nostrum illo id mollitia nulla assumenda veniam quam! Quis repellat esse magnam autem suscipit maiores, ducimus eaque pariatur illum necessitatibus!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam dolorem, ducimus numquam dolores, non, eius officia ut ab quaerat obcaecati voluptatem doloremque deserunt? Rem, ullam enim? Nulla corrupti enim error.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est tenetur deserunt minus fugiat aliquam atque deleniti similique repellat incidunt, asperiores, praesentium doloribus mollitia, voluptatum quasi delectus earum nulla nisi doloremque.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste ratione iure magni animi dicta optio laborum temporibus saepe maxime sequi similique, qui, eveniet eos possimus rem tempora unde cumque! Quis!
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
