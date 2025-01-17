package com.travelbnb.service;

import com.travelbnb.entity.Favourite;
import com.travelbnb.entity.Property;
import com.travelbnb.entity.User;
import com.travelbnb.payload.FavouriteDto;
import com.travelbnb.repository.FavouriteRepository;
import com.travelbnb.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class FavouriteImpl implements FavouriteService{
    private final FavouriteRepository favouriteRepository;
    private final PropertyRepository propertyRepository;

    public FavouriteImpl(FavouriteRepository favouriteRepository, PropertyRepository propertyRepository) {
        this.favouriteRepository = favouriteRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public FavouriteDto addFavourites(User user, FavouriteDto dto, long propertyId) {
        Favourite entity = DtoToEntity(dto);
        final Optional<Property> opProperty = propertyRepository.findById(propertyId);
        if (opProperty.isPresent()) {
            entity.setProperty(opProperty.get());
            entity.setUser(user);
            Favourite save = favouriteRepository.save(entity);
            return EntityToDto(save);
        }
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
    @Override
    public List<FavouriteDto> getAllFavourtesByUser(User user){
        List<Favourite> allFavorites = favouriteRepository.findAllByUserId(user.getId());
        return allFavorites.stream().map(this::EntityToDto).toList();
    }

    public FavouriteDto updateFavouriteStatus(Long id) {
        Favourite favourite = favouriteRepository.findById(id).orElse(null);
        if (favourite!= null) {
            favourite.setStatus(!favourite.getStatus());
            return EntityToDto(favouriteRepository.save(favourite)) ;
        }
        return null;
    }
}
