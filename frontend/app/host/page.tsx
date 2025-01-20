"use client"
import React from 'react';
import { Bell, Menu, Search, CalendarDays, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PropertyCard from '@/components/HostPropertyCard';
import useHost from '@/hooks/useHost';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';
const ListingPage = () => {
  const { properties } = useHost();
  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 h-16">
          <h1 className="text-2xl font-semibold">Your listing</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className='rounded-full bg-gray-100 hover:bg-gray-200'>
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className='rounded-full bg-gray-100 hover:bg-gray-200'>
              <Link href='/host/addProperty'>
                <Plus className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Listing Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, idx) => (

            <PropertyCard key={p.id || idx} property={p} />

          ))}
        </div>
      </main>
    </>
  );
};

export default ListingPage;