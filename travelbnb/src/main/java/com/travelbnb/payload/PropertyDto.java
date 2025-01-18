package com.travelbnb.payload;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class PropertyDto {
    private Long id;
    private String name;
    private Integer noGuests;
    private Integer no_bedrooms;
    private Integer no_bathrooms;
    private Integer price;
    private String country;
    private String location;
    private String description;
    private List<ImageDto> imageUrls;
    private Integer avgRating;
    private FavouriteDto favouriteDto;
    private UserDto user;
    private Set<String> facilities;
}
