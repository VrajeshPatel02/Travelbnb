package com.travelbnb.payload;

import lombok.Data;

import java.util.List;

@Data
public class FormDto {
    private Long id;
    private String name;
    private Integer noGuests;
    private Integer no_bedrooms;
    private Integer no_bathrooms;
    private Integer price;
    private String country;
    private String location;
    private String description;
    private List<ImageDto> image_url;
    private UserDto user;
}
