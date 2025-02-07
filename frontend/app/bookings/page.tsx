'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import BookingService from '@/services/bookingService';
import { format } from 'date-fns';
import { CalendarIcon, DownloadIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Booking {
  id: number;
  property_id: number;
  name: string;
  email: string;
  mobile: string;
  price: number;
  user_id: number;
  totalNight: number;
  totalCost: number;
  checkIn: string;
  checkOut: string;
  imageUrl?: string; // Make this optional
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await BookingService.getUserBookings();
        console.log('Fetched bookings response:', response); // Log the entire response

        // Check if the response is an array and has elements
        if (Array.isArray(response) && response.length > 0) {
          console.log('Fetched bookings:', response); // Log the bookings data
          setBookings(response);
        } else {
          // Handle case where response is empty or undefined
          console.error('No bookings found in response');
          toast.error('No bookings found');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDownloadReceipt = (booking: Booking) => {
    const generatePDF = () => {
      const { jsPDF } = require('jspdf');
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Booking Receipt', 10, 20);
      
      doc.setFontSize(12);
      doc.text(`Property: ${booking.name}`, 10, 30);
      doc.text(`Check-in: ${format(new Date(booking.checkIn), 'MMM d, yyyy')}`, 10, 40);
      doc.text(`Check-out: ${format(new Date(booking.checkOut), 'MMM d, yyyy')}`, 10, 50);
      doc.text(`Total: ₹${booking.totalCost}`, 10, 60);

      doc.save('booking-receipt.pdf');
    };

    generatePDF();
  };

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You have no current bookings.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-1/3">
                  {booking.imageUrl ? (
                    <img 
                      src={booking.imageUrl} 
                      alt={booking.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span>No Image Available</span>
                    </div>
                  )}
                </div>
                <CardContent className="w-2/3 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>{booking.name}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-sm ${booking.price ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {booking.price ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-gray-500" />
                      <span>
                        {format(new Date(booking.checkIn), 'MMM d, yyyy')} - 
                        {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{booking.totalNight} Nights</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Total: ₹{booking.totalCost}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Phone: {booking.mobile}</span> {/* Display phone number */}
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline"
                      onClick={() => handleDownloadReceipt(booking)}
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                    {booking.price === 1 && (
                      <Button variant="destructive">
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}