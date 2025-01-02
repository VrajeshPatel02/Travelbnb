package com.travelbnb.service;

import com.travelbnb.entity.User;
import com.travelbnb.payload.FavouriteDto;

import java.util.List;

public interface FavouriteService {
    FavouriteDto addFavourites(User user, FavouriteDto dto, long propertyId);

    List<FavouriteDto> getAllFavourtesByUser(User user);
}
