package com.travelbnb.payload;

import lombok.Data;

@Data
public class FavouriteDto {
    private long id;
    private boolean status;
    private Long property;
    private Long user;
}
