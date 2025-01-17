package com.travelbnb.payload;

import lombok.Data;

@Data
public class ReviewDto {

    private Long id;
    private Integer rating;
    private String description;
    private UserDto user;
    private Long property;
}
