package com.travelbnb.controller;


import com.stripe.exception.StripeException;
import com.travelbnb.payload.PaymentRequestDTO;
import com.travelbnb.payload.PaymentResponseDTO;
import com.travelbnb.service.PaymentService;
import com.twilio.twiml.voice.Pay;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;


    @PostMapping
    public ResponseEntity<PaymentResponseDTO> processPayment(@RequestBody PaymentRequestDTO paymentRequest){
        try{
            PaymentResponseDTO response = paymentService.processPayment(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (StripeException e){
            PaymentResponseDTO errorResponse = new PaymentResponseDTO();
            errorResponse.setSuccess(false);
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
