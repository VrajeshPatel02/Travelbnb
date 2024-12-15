package com.travelbnb.payload;

import com.travelbnb.entity.Country;
import com.travelbnb.entity.Location;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PropertyDto {
    private Long id;
    private String name;
    private Integer noGuests;
    private Integer no_bedrooms;
    private Integer no_bathrooms;
    private Integer price;
    private Long country;
    private Long location;
    private String image_url;
    private String description;

}
