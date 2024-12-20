package com.travelbnb.config;
import com.twilio.Twilio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @Value("${twilo.whatsapp.number}")
    private String twilioWhatsappNumber;

    @Bean
    public TwilioInitializer twilioInitializer() {
        Twilio.init(accountSid, authToken);
        return new TwilioInitializer();
    }

    public String getTwilioPhoneNumber() {
        return twilioPhoneNumber;
    }

    public String getTwilioWhatsappNumber() {
        return twilioWhatsappNumber;
    }

    public static class TwilioInitializer {
        // You can add more initialization logic here if needed
    }
}
