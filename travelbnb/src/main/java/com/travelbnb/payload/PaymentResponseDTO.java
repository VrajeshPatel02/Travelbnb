package com.travelbnb.payload;

import lombok.Data;

@Data
public class PaymentResponseDTO {
    private boolean success;
    private String transactionId;
    private String message;
    private PaymentDetailsDTO paymentDetails;
}

@Data
class PaymentDetailsDTO {
    private String paymentMethodId;
    private double amount;
    private String currency;
}