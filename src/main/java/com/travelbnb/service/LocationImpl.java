package com.travelbnb.service;

import com.travelbnb.entity.Location;
import com.travelbnb.payload.LocationDto;
import com.travelbnb.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocationImpl implements LocationService{
    private LocationRepository locationRepository;

    public LocationImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public LocationDto addLocation(LocationDto ldto) {
        Location entity = DtoToEntity(ldto);
        LocationDto dto = EntityToDto(entity);
        Location saved = locationRepository.save(entity);
        return dto;
    }

    @Override
    public boolean removeLocation(String name) {
        Optional<Location> location = locationRepository.findByName(name);
        if(location.isPresent()){
            locationRepository.deleteById(location.get().getId());
            return true;
        }
        return false;
    }

    @Override
    public LocationDto updateLocation(LocationDto dto) {
        Optional<Location> location = locationRepository.findById(dto.getId());
        if(location.isPresent()){
            Location saved = locationRepository.save(DtoToEntity(dto));
            return EntityToDto(saved);
        }
        return null;
    }

    @Override
    public LocationDto getLocation(String name) {
        Optional<Location> location = locationRepository.findByName(name);
        if(location.isPresent()){
            return EntityToDto(location.get());
        }
        return null;
    }

    public Location DtoToEntity(LocationDto dto){
        Location entity = new Location();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        return entity;
    }

    public LocationDto EntityToDto(Location entity){
        LocationDto dto = new LocationDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        return dto;
    }
}
