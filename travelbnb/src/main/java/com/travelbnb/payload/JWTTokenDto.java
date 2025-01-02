package com.travelbnb.payload;

import lombok.Data;

@Data
public class JWTTokenDto {
    private String type;

    private UserDto user;

    private String token;
}
