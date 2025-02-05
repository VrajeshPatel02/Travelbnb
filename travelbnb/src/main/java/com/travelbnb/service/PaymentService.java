package com.travelbnb.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.travelbnb.payload.PaymentRequestDTO;
import com.travelbnb.payload.PaymentResponseDTO;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public PaymentResponseDTO processPayment(PaymentRequestDTO paymentRequest) throws StripeException {
        // Set Stripe secret key
        Stripe.apiKey = stripeSecretKey;

        // Convert amount to cents
        long amountInCents = Math.round(paymentRequest.getAmount() * 100);

        // Create PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amountInCents)
            .setCurrency("inr")
            .addPaymentMethodType("card")
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
