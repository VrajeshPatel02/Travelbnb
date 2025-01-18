"use client"
import React from 'react';
import { Bell, Menu, Search, CalendarDays, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';import PropertyCard from '@/components/HostPropertyCard';
import useHost from '@/hooks/useHost';
const ListingPage = () => {
  const { properties } = useHost();
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="w-8 h-8 bg-gray-200 rounded-full" />

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Button variant="ghost">Today</Button>
              <Button variant="ghost">Calendar</Button>
              <Button variant="ghost" className="border-b-2 border-black rounded-none">Listings</Button>
              <Button variant="ghost">Messages</Button>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5" />
              <Menu className="w-5 h-5" />
            </div>
          </div>
        </div>
      </nav>

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
    <PropertyCard key={p.id || idx} property={p}/>
  ))}
</div>
      </main>
    </div>
  );
};

export default ListingPage;