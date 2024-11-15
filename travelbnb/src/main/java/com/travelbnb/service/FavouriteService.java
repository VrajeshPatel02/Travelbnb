package com.travelbnb.service;

import com.travelbnb.entity.User;
import com.travelbnb.payload.FavouriteDto;

public interface FavouriteService {
    FavouriteDto addFavourites(User user, FavouriteDto dto, long propertyId);
    FavouriteDto getAllFavouritesByUser(User user, int pageSize,int pageNo,String sortBy,String sortDir);
}
