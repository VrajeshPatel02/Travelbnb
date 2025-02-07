'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { format } from 'date-fns';
import { CalendarIcon, CreditCard, Loader2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

// Stripe configuration
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

interface PaymentFormProps {
  bookingDetails: BookingDetails;
}

function PaymentForm({ bookingDetails }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Store payment details in localStorage
    localStorage.setItem('paymentDetails', JSON.stringify({
      cardholderName: name,
      email: email
    }));

    // Redirect to payment confirmation page
    router.push('/payment/confirmation');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Cardholder Name</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />
      </div>
      <div>
        <Label>Card Details</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="Card Number" 
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <Input 
            placeholder="Expiry (MM/YY)" 
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <Input 
            placeholder="CVV" 
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-rose-500 hover:bg-rose-600 text-white"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  );
}

export default function PaymentConfirmation() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const storedDetails = localStorage.getItem('bookingDetails');
    if (!storedDetails) {
      router.push('/');
      return;
    }
    setBookingDetails(JSON.parse(storedDetails));
  }, [router]);

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

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="flex items-center gap-4 mb-4">
                <CreditCard className="w-6 h-6 text-gray-500" />
                <p className="font-semibold">Credit / Debit Card</p>
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
              
              <Elements stripe={stripePromise}>
                <PaymentForm bookingDetails={bookingDetails} />
              </Elements>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 