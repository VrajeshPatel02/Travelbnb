package com.travelbnb.payload;

import lombok.Data;

import java.util.List;

@Data
public class    AllPropertyDto {
    private Long id;

    private String country;
    private String location;
    private Integer price;


}
