package com.travelbnb.payload;


import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String paymentMethodId;
    private BookingDto bookingDetails;
    private CustomerDetailsDTO customerDetails;
}

@Data
class CustomerDetailsDTO {
    private String name;
    private String email;
}