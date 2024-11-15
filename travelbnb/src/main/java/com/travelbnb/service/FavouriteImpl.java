package com.travelbnb.service;

import com.travelbnb.entity.Favourite;
import com.travelbnb.entity.Property;
import com.travelbnb.entity.User;
import com.travelbnb.payload.FavouriteDto;
import com.travelbnb.repository.FavouriteRepository;
import com.travelbnb.repository.PropertyRepository;
import org.springframework.stereotype.Service;

@Service

public class FavouriteImpl implements FavouriteService{
    private FavouriteRepository favouriteRepository;
    private PropertyRepository propertyRepository;

    public FavouriteImpl(FavouriteRepository favouriteRepository, PropertyRepository propertyRepository) {
        this.favouriteRepository = favouriteRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public FavouriteDto addFavourites(User user, FavouriteDto dto, long propertyId) {
        Favourite entity = DtoToEntity(dto);
        Property property = (propertyRepository.findById(propertyId)).get();
        entity.setProperty(property);
        entity.setUser(user);
        favouriteRepository.save(entity);
        return EntityToDto(entity);
    }

    @Override
    public FavouriteDto getAllFavouritesByUser(User user, int pageSize, int pageNo, String sortBy, String sortDir) {

        return null;
    }

    public Favourite DtoToEntity(FavouriteDto dto) {
        Favourite entity = new Favourite();
        entity.setId(dto.getId());
        entity.setStatus(dto.isStatus());
        return entity;
    }
    public FavouriteDto EntityToDto(Favourite entity) {
        FavouriteDto dto = new FavouriteDto();
        dto.setId(entity.getId());
        dto.setStatus(entity.getStatus());
        dto.setProperty(entity.getProperty().getId());
        dto.setUser(entity.getUser().getId());
        return dto;
    }
}
