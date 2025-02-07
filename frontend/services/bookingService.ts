import { Booking } from "@/types/booking";
import api from "./authService";
import { handleApiError } from "./errorHandler";

class BookingService {
    async confirmBooking(booking: Booking, propertyId: number): Promise<any> {
        try {
            // Add more detailed logging
            console.log('Booking DTO:', booking);
            console.log('Property ID:', propertyId);

            const response = await api.post(`/bookings/createBooking?propertyId=${propertyId}`, {
                ...booking,
                // Ensure date format is correct
                checkIn: booking.checkIn instanceof Date 
                    ? booking.checkIn.toISOString().split('T')[0] 
                    : booking.checkIn,
                checkOut: booking.checkOut instanceof Date 
                    ? booking.checkOut.toISOString().split('T')[0] 
                    : booking.checkOut
            });
            return response.data;
        } catch (error) {
            console.error('Booking creation error:', error);
            return handleApiError(error);
        }
    }

  async getUserBookings(): Promise<any>{
        try{
            const response = await api.get('/bookings/userBookings');
            return response.data;
        }catch (error){
            console.error('Error fetching user bookings:',error);
            return handleApiError(error);
        }
}
}

export default new BookingService();