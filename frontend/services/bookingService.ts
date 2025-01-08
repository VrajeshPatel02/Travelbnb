import { Booking } from "@/types/booking";
import { handleApiError } from "./errorHandler";
import api from "./authService";

class BookingService {
    async confirmBooking(booking: Booking, propertyId: number ): Promise<void> {
        try {
            const response = await api.post(`/bookings/createBooking?propertyId=${propertyId}`, booking);
            return response.data;
          } catch (error) {
            return handleApiError(error);
          }

    }
}
export const bookingService = new BookingService();