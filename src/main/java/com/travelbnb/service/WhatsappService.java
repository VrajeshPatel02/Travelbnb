package com.travelbnb.service;

import com.travelbnb.config.TwilioConfig;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class WhatsappService {
    private TwilioConfig twilioConfig;


    public WhatsappService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }
    public String sendWhatsappMessage(String to, String body){
        Message message = Message.creator(
                new PhoneNumber("whatsapp:+91"+to),
                new PhoneNumber(twilioConfig.getTwilioWhatsappNumber()),
                body
        ).create();
        return message.getSid();
    }

}
