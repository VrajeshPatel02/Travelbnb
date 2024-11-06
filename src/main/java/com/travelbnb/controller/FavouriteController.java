package com.travelbnb.controller;

import com.travelbnb.entity.User;
import com.travelbnb.payload.FavouriteDto;
import com.travelbnb.service.FavouriteImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/favourite")
public class FavouriteController {
    private FavouriteImpl favorite;

    public FavouriteController(FavouriteImpl favorite) {
        this.favorite = favorite;
    }

    @PostMapping("/myfavourites")
    public ResponseEntity<?> addFavouriteProperty(
            @AuthenticationPrincipal User user,
            @RequestParam Long propertyId,
            @RequestBody FavouriteDto dto
    )
    {
        FavouriteDto favouriteDto = favorite.addFavourites(user, dto, propertyId);
        return new ResponseEntity<>(favouriteDto, HttpStatus.CREATED);
    }
}
