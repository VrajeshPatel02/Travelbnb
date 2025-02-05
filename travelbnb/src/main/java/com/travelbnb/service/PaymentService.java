package com.travelbnb.service;


import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.travelbnb.payload.PaymentRequestDTO;
import com.travelbnb.payload.PaymentResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    public PaymentResponseDTO processPayment(PaymentRequestDTO paymentRequest) throws StripeException{
        long amountInCents = Math.round(paymentRequest.getBookingDetails().getTotalNightlyPrice()* 100);


        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("inr")
                .setPaymentMethod(paymentRequest.getPaymentMethodId())
                .setConfirm(true)
                .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);


        // Prepare response
        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setSuccess(true);
        response.setTransactionId(paymentIntent.getId());
        response.setMessage("Payment processed successfully");

        return response;

    }


}
