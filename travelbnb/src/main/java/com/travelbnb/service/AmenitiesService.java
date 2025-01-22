package com.travelbnb.service;

import com.travelbnb.payload.AmenitiesDto;

public interface AmenitiesService {
    AmenitiesDto addAmenities(AmenitiesDto ado, Long propertyId);
    AmenitiesDto updateAmenities(AmenitiesDto dto, Long propertyId);

    AmenitiesDto getAmenitiesByProperty(Long propertyId);
}
