package com.travelbnb.service;

import com.travelbnb.entity.User;
import com.travelbnb.payload.BookingDto;

public interface BookingService {
    BookingDto addBooking(BookingDto dto, Long propertyId, User user);
}
