'use client';

import BookingService from '@/services/bookingService';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function PaymentConfirmation() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const isProcessingRef = useRef(false); // Use a ref to track processing state

    useEffect(() => {
        const createBooking = async () => {
            if (isProcessingRef.current) return; // Prevent multiple submissions
            isProcessingRef.current = true; // Set processing to true

            console.log('Creating booking...'); // Debugging log
            let bookingDetails;
            try {
                // Retrieve booking and payment details from localStorage
                const bookingDetailsString = localStorage.getItem('bookingDetails');
                const paymentDetailsString = localStorage.getItem('paymentDetails');

                if (!bookingDetailsString || !paymentDetailsString) {
                    toast.error('Booking details not found');
                    router.push('/');
                    return;
                }

                bookingDetails = JSON.parse(bookingDetailsString);
                const paymentDetails = JSON.parse(paymentDetailsString);

                // Prepare booking DTO
                const bookingDto = {
                    name: paymentDetails.cardholderName,
                    email: paymentDetails.email,
                    mobile: paymentDetails.mobile || '+917802033371', // Fallback to a valid number
                    price: bookingDetails.pricePerNight,
                    totalNight: bookingDetails.nights,
                    totalCost: bookingDetails.total,
                    checkIn: bookingDetails.checkIn,
                    checkOut: bookingDetails.checkOut,
                    totalNightlyPrice: bookingDetails.pricePerNight,
                };

                console.log('Booking DTO for creation:', bookingDto); // Debugging log

                // Create booking
                const result = await BookingService.confirmBooking(
                    bookingDto,
                    bookingDetails.propertyId
                );

                console.log('Booking creation result:', result); // Debugging log
                toast.success('Booking confirmed successfully!');

                // Clear booking and payment details
                localStorage.removeItem('bookingDetails');
                localStorage.removeItem('paymentDetails');

                // Redirect to bookings page
                router.push('/bookings');

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                console.error('Booking creation failed', error);

                toast.error('Booking Failed', {
                    description: errorMessage,
                });

                if (bookingDetails) {
                    router.push(`/property/${bookingDetails.propertyId}`);
                } else {
                    router.push('/');
                }
            } finally {
                isProcessingRef.current = false; // Reset processing state
            }
        };

        createBooking();
    }, [router]);

    if (isProcessing) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Processing your booking...</p>
            </div>
        );
    }

    return null;
}