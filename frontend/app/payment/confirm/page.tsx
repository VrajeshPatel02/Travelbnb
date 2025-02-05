'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BookingDetails {
  propertyId: number;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  imageUrl: string;
}

export default function PaymentConfirmation() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedDetails = localStorage.getItem('bookingDetails');
    if (!storedDetails) {
      router.push('/');
      return;
    }
    setBookingDetails(JSON.parse(storedDetails));
  }, [router]);

  const handleConfirmPayment = async () => {
    if (!bookingDetails) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails)
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store payment confirmation details
        localStorage.setItem('paymentConfirmation', JSON.stringify({
          ...result.paymentDetails,
          bookingDetails
        }));

        // Clear booking details
        localStorage.removeItem('bookingDetails');

        // Show success toast
        toast.success('Payment Processed Successfully', {
          description: `Transaction ID: ${result.transactionId}`
        });

        // Redirect to success page
        router.push('/payment/success');
      } else {
        // Show error toast
        toast.error('Payment Failed', {
          description: result.message || 'Unknown error occurred'
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment Processing Error', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Confirm and Pay</h1>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Trip</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CalendarIcon className="w-6 h-6 text-gray-500" />
                  <div>
                    <p className="font-semibold">Dates</p>
                    <p className="text-gray-600">
                      {format(new Date(bookingDetails.checkIn), 'MMM d, yyyy')} - {format(new Date(bookingDetails.checkOut), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-gray-500" />
                  <div>
                    <p className="font-semibold">Guests</p>
                    <p className="text-gray-600">{bookingDetails.guests} guests</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Price Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>₹{bookingDetails.pricePerNight} × {bookingDetails.nights} nights</span>
                  <span>₹{bookingDetails.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>₹{bookingDetails.cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{bookingDetails.serviceFee}</span>
                </div>
                <div className="border-t pt-3 font-semibold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₹{bookingDetails.total}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="p-6 sticky top-8">
              <div className="flex gap-4 mb-6">
                <img
                  src={bookingDetails.imageUrl}
                  alt={bookingDetails.propertyName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{bookingDetails.propertyName}</h3>
                  <p className="text-sm text-gray-600">
                    {bookingDetails.nights} nights · {bookingDetails.guests} guests
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 