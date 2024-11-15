package com.travelbnb.service;

import com.travelbnb.entity.Property;
import com.travelbnb.payload.PropertyDto;

import java.util.List;

public interface PropertyService {

    List<PropertyDto> searchProperty(String name,int pageSize, int pageNo, String sortBy, String sortDir);

    PropertyDto addProperty(PropertyDto pdto, long countryId, long locationId);
    boolean deleteProperty(Long id);
    PropertyDto updatePropertyDetails(PropertyDto pdto);

    List<PropertyDto> getAll(int pageSize, int pageNo, String sortBy, String sortDir);
}
