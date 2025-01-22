package com.travelbnb.payload;

import lombok.Data;

import java.util.Date;

@Data
public class ReviewDto {

    private Long id;
    private Integer rating;
    private String description;
    private UserDto user;
    private Long property;

    private Date createdAt;
}
