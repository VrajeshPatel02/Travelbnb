"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Star, Heart, Share, MapPin } from 'lucide-react';
import { useProperty } from "@/hooks/useProperty";

const PropertyDetails = () => {
  const { id } = useParams(); // Fetch property ID from the URL
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);
  const router = useRouter();

  const [guestCount, setGuestCount] = useState(1);
  const [nights, setNights] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Handlers for Guests
  const increaseGuestCount = () => setGuestCount((prev) => Math.min(prev + 1, property?.noGuests || prev));
  const decreaseGuestCount = () => setGuestCount((prev) => Math.max(prev - 1, 1));

  const { property, toggleFavorite, isLoading } = useProperty(Number(id));

  if (!property || isLoading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <>
      <Navbar setSearchResults={() => { }} resetSearch={() => { }} />
      <div className="min-h-screen pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.name}</h1>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-rose-500" />
              <span className="font-semibold">4.9</span>
              <span className="text-gray-500">·</span>
              <span className="underline font-semibold">289 reviews</span>
              <span className="text-gray-500">·</span>
              <MapPin className="w-4 h-4" />
              <span className="underline font-semibold">{property.location}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md transition duration-200">
                <Share className="w-4 h-4" />
                <span className="underline font-semibold">Share</span>
              </button>
              <button
                onClick={toggleFavorite}
                className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md transition duration-200"
              >
                <Heart
                  className={`w-4 h-4 ${property.favouriteDto.status ? "fill-red-500 text-red-500" : "text-black"
                    }`}
                />
                <span className="underline font-semibold">
                  {property.favouriteDto.status ? 'Saved' : 'Save'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] mb-8">
            <div className="col-span-2 row-span-2 relative">
              <img
                src={property.imageUrls[0].imageUrl}
                alt="Main property view"
                className="w-full h-full object-cover rounded-l-2xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src={property.imageUrls[1].imageUrl}
                alt="Property detail 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src={property.imageUrls[2].imageUrl}
                alt="Property detail 2"
                className="w-full h-full object-cover rounded-tr-2xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src={property.imageUrls[3].imageUrl}
                alt="Property detail 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1 relative">
              <img
                src={property.imageUrls[4].imageUrl}
                alt="Property detail 4"
                className="w-full h-full object-cover rounded-br-2xl"
              />
              <Button
                variant="secondary"
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-100"
              >
                Show all photos
              </Button>
            </div>
          </div>

          <div className="flex justify-between space-x-12">
            <div className="w-2/3">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Entire villa hosted by john doe
                  </h2>
                  <p className="text-gray-600">
                    {property.noGuests} guests · {property.no_bedrooms} bedrooms · {property.no_bathrooms} bathrooms
                  </p>
                </div>
                <img
                  src="https://via.placeholder.com/64"
                  alt="Host"
                  className="w-16 h-16 rounded-full"
                />
              </div>

              <hr className="my-8" />

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About this space</h3>
                <p className="text-gray-600">{property.description}</p>
              </div>

              <hr className="my-8" />

              <div>
                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                <ul className="grid grid-cols-2 gap-4">
                  {['Kitchen', 'Wifi', 'Free parking', 'Pool'].map((amenity) => (
                    <li key={amenity} className="flex items-center space-x-2">
                      <span className="text-gray-600">{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-1/3">
              <Card className="p-6 sticky top-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold">₹{property.price.toLocaleString()}</span>
                    <span className="text-gray-500"> / night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-rose-500 mr-1" />
                    <span className="font-semibold">4.9</span>
                    <span className="text-gray-500 ml-1">(289)</span>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                  <div className="flex">
                    <div className="w-1/2 p-2 border-r border-gray-300">
                      <div className="text-xs uppercase font-bold text-gray-500">Check-in</div>
                      <div>{format(date || new Date(), "MMM d, yyyy")}</div>
                    </div>
                    <div className="w-1/2 p-2">
                      <div className="text-xs uppercase font-bold text-gray-500">Checkout</div>
                      <div>{format(date ? new Date(date.getTime() + nights * 24 * 60 * 60 * 1000) : new Date(), "MMM d, yyyy")}</div>
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full rounded-none border-t border-gray-300">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mb-4">
                      {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">Adults</div>
                          <div className="text-sm text-gray-500">Age 13+</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={decreaseGuestCount}
                            disabled={guestCount <= 1}
                          >
                            -
                          </Button>
                          <span>{guestCount}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={increaseGuestCount}
                            disabled={guestCount >= property.noGuests}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" onClick={()=> router.push(`/property/${property.id}/confirm-pay`)}>
                  Reserve
                </Button>

                <div className="text-center text-gray-500 mt-4">
                  You won't be charged yet
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="underline">₹{property.price.toLocaleString()} x {nights} nights</span>
                    <span>₹{(property.price * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Cleaning fee</span>
                    <span>₹1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Service fee</span>
                    <span>₹2,000</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{(property.price * nights + 3000).toLocaleString()}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;

