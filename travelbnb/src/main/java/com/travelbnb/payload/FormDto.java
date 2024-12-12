package com.travelbnb.payload;

import lombok.Data;

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
    private String image_url;
}
