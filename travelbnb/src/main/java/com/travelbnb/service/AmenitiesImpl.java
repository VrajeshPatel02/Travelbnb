package com.travelbnb.service;

import com.travelbnb.entity.Amenities;
import com.travelbnb.entity.Property;
import com.travelbnb.exception.ResourceNotFoundException;
import com.travelbnb.payload.AmenitiesDto;
import com.travelbnb.repository.AmenitiesRepository;
import com.travelbnb.repository.PropertyRepository;
import org.springframework.stereotype.Service;

@Service
public class AmenitiesImpl implements AmenitiesService {
    private final AmenitiesRepository amenitiesRepository;
    private final PropertyRepository propertyRepository;

    public AmenitiesImpl(AmenitiesRepository amenitiesRepository, PropertyRepository propertyRepository) {
        this.amenitiesRepository = amenitiesRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public AmenitiesDto addAmenities(AmenitiesDto ado, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property Not Found"));
        Amenities entity = amenitiesRepository.findByProperty(property.getId());
        Amenities amenities = DtoToEntity(ado);
        amenities.setProperty(property);
        Amenities saved = amenitiesRepository.save(amenities);
        return EntityToDto(saved);
    }

    @Override
    public AmenitiesDto updateAmenities(AmenitiesDto dto, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property Not Found"));
        Amenities existingAmenities = amenitiesRepository.findByProperty(property.getId());
        if (existingAmenities == null) {
            throw new ResourceNotFoundException("Amenities for the specified property not found");
        }

        existingAmenities.setGym(dto.getGym() != null ? dto.getGym() : existingAmenities.getGym());
        existingAmenities.setFireplace(dto.getFireplace() != null ? dto.getFireplace() : existingAmenities.getFireplace());
        existingAmenities.setDryer(dto.getDryer() != null ? dto.getDryer() : existingAmenities.getDryer());
        existingAmenities.setTv(dto.getTv() != null ? dto.getTv() : existingAmenities.getTv());
        existingAmenities.setHeating(dto.getHeating() != null ? dto.getHeating() : existingAmenities.getHeating());
        existingAmenities.setPool(dto.getPool() != null ? dto.getPool() : existingAmenities.getPool());
        existingAmenities.setAirConditioning(dto.getAirConditioning() != null ? dto.getAirConditioning() : existingAmenities.getAirConditioning());
        existingAmenities.setKitchen(dto.getKitchen() != null ? dto.getKitchen() : existingAmenities.getKitchen());
        existingAmenities.setFreeParking(dto.getFreeParking() != null ? dto.getFreeParking() : existingAmenities.getFreeParking());
        existingAmenities.setWifi(dto.getWifi() != null ? dto.getWifi() : existingAmenities.getWifi());
        existingAmenities.setWashingMachine(dto.getWashingMachine() != null ? dto.getWashingMachine() : existingAmenities.getWashingMachine());
        existingAmenities.setSelfCheckIn(dto.getSelfCheckIn() != null ? dto.getSelfCheckIn() : existingAmenities.getSelfCheckIn());
        existingAmenities.setHotTub(dto.getHotTub() != null ? dto.getHotTub() : existingAmenities.getHotTub());

        Amenities updatedAmenities = amenitiesRepository.save(existingAmenities);
        return EntityToDto(updatedAmenities);
    }

    @Override
    public AmenitiesDto getAmenitiesByProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId).orElseThrow(()-> new ResourceNotFoundException("Property does not exist."));
        Amenities amenities = amenitiesRepository.findByProperty(property.getId());
        return EntityToDto(amenities);
    }

    public AmenitiesDto EntityToDto(Amenities entity) {
        AmenitiesDto ado = new AmenitiesDto();
        ado.setId(entity.getId());
        ado.setProperty(entity.getProperty().getId());
        ado.setGym(entity.getGym());
        ado.setFireplace(entity.getFireplace());
        ado.setDryer(entity.getDryer());
        ado.setTv(entity.getTv());
        ado.setHeating(entity.getHeating());
        ado.setPool(entity.getPool());
        ado.setAirConditioning(entity.getAirConditioning());
        ado.setKitchen(entity.getKitchen());
        ado.setFreeParking(entity.getFreeParking());
        ado.setWifi(entity.getWifi());
        ado.setWashingMachine(entity.getWashingMachine());
        ado.setSelfCheckIn(entity.getSelfCheckIn());
        ado.setHotTub(entity.getHotTub());

        return ado;
    }

    public Amenities DtoToEntity(AmenitiesDto dto) {
        Amenities entity = new Amenities();
        entity.setId(dto.getId());
        entity.setGym(dto.getGym() != null ? dto.getGym() : false);
        entity.setFireplace(dto.getFireplace() != null ? dto.getFireplace() : false);
        entity.setDryer(dto.getDryer() != null ? dto.getDryer() : false);
        entity.setTv(dto.getTv() != null ? dto.getTv() : false);
        entity.setHeating(dto.getHeating() != null ? dto.getHeating() : false);
        entity.setPool(dto.getPool() != null ? dto.getPool() : false);
        entity.setAirConditioning(dto.getAirConditioning() != null ? dto.getAirConditioning() : false);
        entity.setKitchen(dto.getKitchen() != null ? dto.getKitchen() : false);
        entity.setFreeParking(dto.getFreeParking() != null ? dto.getFreeParking() : false);
        entity.setWifi(dto.getWifi() != null ? dto.getWifi() : false);
        entity.setWashingMachine(dto.getWashingMachine() != null ? dto.getWashingMachine() : false);
        entity.setSelfCheckIn(dto.getSelfCheckIn() != null ? dto.getSelfCheckIn() : false);
        entity.setHotTub(dto.getHotTub() != null ? dto.getHotTub() : false);
        return entity;
    }
}
