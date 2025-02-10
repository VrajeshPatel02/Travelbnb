"use client";

import Navbar from "@/components/Navbar";
import ReviewSection from "@/components/ReviewSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useProperty } from "@/hooks/useProperty";
import { usePropertyReviews } from "@/hooks/useReview";
import { Property } from "@/types/property";
import { PopoverClose } from "@radix-ui/react-popover";
import { differenceInDays, format, isPast, isToday } from "date-fns";
import { CalendarIcon, Heart, MapPin, Share, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// Dynamically import the Map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

const PropertyDetails = () => {
  const { id } = useParams(); // Fetch property ID from the URL
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);
  const router = useRouter();

  const [guestCount, setGuestCount] = useState(1);
  const [nights, setNights] = useState(1);
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Additional calendar state (optional, but can be used for more flexibility)
  const [additionalDateRange, setAdditionalDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Handlers for Guests
  const increaseGuestCount = () => setGuestCount((prev) => Math.min(prev + 1, property?.noGuests || prev));
  const decreaseGuestCount = () => setGuestCount((prev) => Math.max(prev - 1, 1));

  const { property, toggleFavorite, isLoading } = useProperty(Number(id));
  const { reviews, isLoading: reviewsLoading, message, averageRating, totalReviews } = usePropertyReviews(Number(id));

  // Add state for facilities
  const [facilities, setFacilities] = useState<string[]>([]);

  // Fetch facilities when property is loaded
  useEffect(() => {
    const fetchFacilities = async () => {
      if (property) {
        try {
          // Assuming the property object already contains facilities from the backend
          setFacilities(property.facilities || []);
        } catch (error) {
          console.error("Error fetching facilities:", error);
        }
      }
    };

    fetchFacilities();
  }, [property]);

  // Simplified and more robust date range selection handler
  const handleDateRangeSelect = (
    range?: { from?: Date; to?: Date }, 
    rangeType: 'main' | 'additional' = 'main'
  ) => {
    if (!range || (!range.from && !range.to)) {
      // Clear both ranges if no dates selected
      setDateRange({});
      setAdditionalDateRange({});
      return;
    }

    // Update both ranges simultaneously
    setDateRange({
      from: range.from,
      to: range.to
    });

    setAdditionalDateRange({
      from: range.from,
      to: range.to
    });
  };

  // Calculate total cost with additional fees
  const calculateCostBreakdown = () => {
    if (dateRange.from && dateRange.to && property) {
      const nights = differenceInDays(dateRange.to, dateRange.from);
      const nightlyRate = property.price;
      const subtotal = nights * nightlyRate;
      
      const cleaningFee = 500;
      const serviceFee = Math.ceil(subtotal * 0.14);
      
      const total = subtotal + cleaningFee + serviceFee;

      return {
        nights,
        nightlyRate,
        subtotal,
        cleaningFee,
        serviceFee,
        total
      };
    }
    return null;
  };

  // Disable past dates and today's date
  const isPastOrTodayDate = (date: Date) => {
    return isPast(date) || isToday(date);
  };

  // Add a method to clear dates
  const clearDates = () => {
    setDateRange({});
    setAdditionalDateRange({});
  };

  const handleReserveClick = () => {
    if (!dateRange.from || !dateRange.to || !property) return;
    
    const costBreakdown = calculateCostBreakdown();
    if (!costBreakdown) return;

    const bookingDetails = {
      propertyId: property.id,
      propertyName: property.name,
      checkIn: dateRange.from.toISOString(),
      checkOut: dateRange.to.toISOString(),
      guests: guestCount,
      nights: costBreakdown.nights,
      pricePerNight: costBreakdown.nightlyRate,
      subtotal: costBreakdown.subtotal,
      cleaningFee: costBreakdown.cleaningFee,
      serviceFee: costBreakdown.serviceFee,
      total: costBreakdown.total,
      imageUrl: property.imageUrls[0].imageUrl
    };

    // Store booking details in localStorage or state management
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    
    // Navigate to payment confirmation page
    router.push(`/payment/confirm`);
  };

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
              <span className="font-semibold">{averageRating}</span>
              <span className="text-gray-500">·</span>
              <span className="underline font-semibold">{totalReviews} reviews</span>
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
                  {facilities.map((facility) => (
                    <li key={facility} className="flex items-center space-x-2">
                      <span className="text-gray-600">{facility}</span>
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
                    <span className="font-semibold">{averageRating}</span>
                    <span className="text-gray-500 ml-1">({totalReviews})</span>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                  <div className="flex">
                    <div className="w-1/2 p-2 border-r border-gray-300">
                      <div className="text-xs uppercase font-bold text-gray-500">Check-in</div>
                      <div>{dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Add dates"}</div>
                    </div>
                    <div className="w-1/2 p-2">
                      <div className="text-xs uppercase font-bold text-gray-500">Checkout</div>
                      <div>{dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Add dates"}</div>
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full rounded-none border-t border-gray-300">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-auto p-0 relative" 
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                      <div className="relative">
                        <DayPicker
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => handleDateRangeSelect(range, 'main')}
                          disabled={isPastOrTodayDate}
                          numberOfMonths={2}
                          className="border rounded-lg p-4 shadow-md"
                          classNames={{
                            day_range_start: "bg-rose-500 text-white rounded-full",
                            day_range_end: "bg-rose-500 text-white rounded-full",
                            day_range_middle: "bg-rose-100 text-rose-600 rounded-none",
                            day_selected: "bg-rose-500 text-white rounded-full",
                          }}
                          styles={{
                            day: {
                              position: 'relative',
                            }
                          }}
                          modifiersStyles={{
                            range: {
                              backgroundColor: 'rgb(254 205 211 / 0.5)', // rose-200 with opacity
                              color: 'rgb(190 18 60)', // rose-600
                            },
                            range_start: {
                              backgroundColor: 'rgb(244 63 94)', // rose-500
                              color: 'white',
                            },
                            range_end: {
                              backgroundColor: 'rgb(244 63 94)', // rose-500
                              color: 'white',
                            }
                          }}
                          modifiers={{
                            range: (date) => {
                              if (!dateRange.from || !dateRange.to) return false;
                              return (
                                date >= dateRange.from && 
                                date <= dateRange.to
                              );
                            }
                          }}
                        />
                        {(dateRange.from && dateRange.to) && (
                          <div className="absolute bottom-4 right-4 z-50 flex space-x-2">
                            <button 
                              onClick={clearDates}
                              className="bg-rose-100 text-rose-600 px-3 py-1.5 rounded-md text-sm hover:bg-rose-200 transition-colors"
                            >
                              Clear
                            </button>
                            <PopoverClose asChild>
                              <button 
                                className="bg-rose-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-rose-600 transition-colors"
                              >
                                Close
                              </button>
                            </PopoverClose>
                          </div>
                        )}
                      </div>
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

                <div>
                  <div className="bg-white border rounded-lg p-6 shadow-md">
                    {/* Detailed Cost Breakdown */}
                    {dateRange.from && dateRange.to && (
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between">
                          <span>₹{property.price} x {calculateCostBreakdown()?.nights} nights</span>
                          <span>₹{calculateCostBreakdown()?.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Cleaning fee</span>
                          <span>₹{calculateCostBreakdown()?.cleaningFee}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Service fee</span>
                          <span>₹{calculateCostBreakdown()?.serviceFee}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{calculateCostBreakdown()?.total}</span>
                        </div>
                      </div>
                    )}

                    {/* Reserve Button */}
                    <button 
                      className={`w-full py-3 rounded-lg ${
                        dateRange.from && dateRange.to 
                          ? 'bg-rose-500 text-white hover:bg-rose-600' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!dateRange.from || !dateRange.to}
                      onClick={handleReserveClick}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* New Additional Calendar Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-bold text-gray-900">Select Your Dates</h3>
            
            </div>
            <p className="text-lg text-gray-600">
              Select your travel dates and explore availability for this stunning property. 
              Flexible booking options to suit your travel plans.
            </p>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <CalendarIcon className="w-6 h-6 text-rose-500" />
              <div>
                <p className="font-semibold text-gray-800">Flexible Dates</p>
                <p className="text-sm text-gray-500">
                  {dateRange.from && dateRange.to 
                    ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                    : 'Select your travel dates'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
            <DayPicker
              mode="range"
              selected={additionalDateRange}
              onSelect={(range) => handleDateRangeSelect(range, 'additional')}
              disabled={isPastOrTodayDate}
              numberOfMonths={2}
              className="p-6 border-none"
              styles={{
                day: {
                  position: 'relative',
                }
              }}
              classNames={{
                caption: "flex justify-between items-center",
                caption_label: "text-lg font-bold text-gray-800",
                nav_button: "hover:bg-gray-100 rounded-full p-2",
                nav_button_previous: "absolute left-2",
                nav_button_next: "absolute right-2",
                head_cell: "text-gray-500 uppercase text-xs font-semibold",
                cell: "p-1 text-center relative",
                day: "hover:bg-rose-100 hover:text-rose-600 rounded-full relative",
                day_range_start: "bg-rose-500 text-white rounded-full z-10 relative",
                day_range_end: "bg-rose-500 text-white rounded-full z-10 relative",
                day_range_middle: "bg-rose-100 text-rose-600 rounded-none relative",
                day_selected: "bg-rose-500 text-white rounded-full",
                day_today: "bg-gray-100 text-gray-900 rounded-full",
                day_outside: "text-gray-300",
              }}
              modifiersStyles={{
                range: {
                  backgroundColor: 'rgb(254 205 211 / 0.5)', // rose-200 with opacity
                  color: 'rgb(190 18 60)', // rose-600
                },
                range_start: {
                  backgroundColor: 'rgb(244 63 94)', // rose-500
                  color: 'white',
                },
                range_end: {
                  backgroundColor: 'rgb(244 63 94)', // rose-500
                  color: 'white',
                }
              }}
              modifiers={{
                range: (date) => {
                  if (!additionalDateRange.from || !additionalDateRange.to) return false;
                  return (
                    date >= additionalDateRange.from && 
                    date <= additionalDateRange.to
                  );
                }
              }}
            />
            {additionalDateRange.from && additionalDateRange.to && (
              <button 
                onClick={clearDates}
                className="absolute bottom-4 right-4 z-50 bg-rose-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-rose-600 transition-colors"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* reviews section*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReviewSection 
          reviews={reviews} 
          isLoading={reviewsLoading} 
          message={message} 
          avgRating={averageRating} 
          totalReviews={totalReviews} 
        />
      </div>

      {/* Where You'll Be Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">Where You'll Be</h3>
            <Card className="bg-gray-50 border-none shadow-lg p-6 rounded-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-rose-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p className="text-gray-600">{property.location}, {property.country}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  This property is nestled in the heart of {property.location}, offering a unique blend of 
                  local charm and natural beauty. Experience the authentic essence of the region 
                  with stunning surroundings and local attractions nearby.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Neighborhood</p>
                    <p className="font-semibold">{property.location}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-semibold">{property.country}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <MapComponent 
              location={`${property.location}, ${property.country}`} 
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white rounded-lg shadow-lg p-4 inline-block">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <p className="text-gray-800 font-semibold whitespace-nowrap">
                    Exact location provided after booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

 
    </>
  );
};

export default PropertyDetails;

