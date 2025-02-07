package com.travelbnb.service;

import com.travelbnb.entity.User;
import com.travelbnb.payload.BookingDto;

import java.util.List;

public interface BookingService {
    BookingDto addBooking(BookingDto dto, Long propertyId, User user);

    List<BookingDto> getUserBookings(User user);
}
