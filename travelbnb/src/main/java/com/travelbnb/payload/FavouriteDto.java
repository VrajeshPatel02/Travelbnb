package com.travelbnb.payload;

import lombok.Data;

@Data
public class FavouriteDto {
    private long id;
    private boolean status;
    private Long property;
    private Long user;
    public FavouriteDto(Boolean status) {
        this.status = status;
    }

    public FavouriteDto(long id, boolean status, Long property, Long user) {
        this.id = id;
        this.status = status;
        this.property = property;
        this.user = user;
    }

    public FavouriteDto() {
    }
}

