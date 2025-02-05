package com.travelbnb.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {
    private String cardholderName;
    private String email;
    private double amount;
    private CardDetails cardDetails;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CardDetails {
        private String number;
        private String expiry;
        private String cvv;
    }
}