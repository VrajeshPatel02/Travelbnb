import { bookingService } from "@/services/bookingService"
import { Booking } from "@/types/booking"

export const useBooking =  () => {
    const onSubmit = async (data: Booking, id:number)=> {
        try{
            const response = await bookingService.confirmBooking(data, id);
            console.log("Booking Confirmed")
            return response;
        }catch(error){
            console.log("Failed to Book")
        }
    }
    return {
        onSubmit
    };
};