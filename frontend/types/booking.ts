export interface Booking {
    id?: number;
    property_id?: number;
    name: string;
    email: string;
    mobile: string;
    price: number;
    user_id?: number;
    totalNight: number;
    totalCost: number;
    checkIn: string | Date;
    checkOut: string | Date;
    totalNightlyPrice?: number;
    imageUrl: string;
}