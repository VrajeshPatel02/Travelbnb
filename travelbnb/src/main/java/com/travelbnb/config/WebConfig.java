package com.travelbnb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // This applies CORS to all endpoints
                        .allowedOrigins("http://localhost:3000") // Allow the React frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowCredentials(true); // Allow cookies (JWT tokens in some cases)
            }
        };
    }
}

