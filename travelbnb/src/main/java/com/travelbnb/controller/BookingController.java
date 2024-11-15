package com.travelbnb.controller;

import com.travelbnb.entity.User;
import com.travelbnb.payload.BookingDto;
import com.travelbnb.service.BookingImpl;
import com.travelbnb.service.SmsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private BookingImpl booking;

    public BookingController(BookingImpl booking) {
        this.booking = booking;
    }

    @PostMapping("/createBooking")
    public ResponseEntity<?> createBooking(@RequestParam Long propertyId,
                                           @RequestBody BookingDto dto,
                                           @AuthenticationPrincipal User user){
        BookingDto bookingDto = booking.addBooking(dto, propertyId, user);
        return new ResponseEntity<>(bookingDto, HttpStatus.CREATED);
    }
}
