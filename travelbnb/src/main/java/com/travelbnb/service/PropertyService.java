package com.travelbnb.service;

import com.travelbnb.entity.Property;
import com.travelbnb.payload.FormDto;
import com.travelbnb.payload.PropertyDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PropertyService {

    List<PropertyDto> searchProperty(String name);

    PropertyDto addProperty(PropertyDto pdto, long countryId, long locationId);
    boolean deleteProperty(Long id);
    PropertyDto updatePropertyDetails(PropertyDto pdto);

    List<PropertyDto> getAll(int pageSize, int pageNo, String sortBy, String sortDir);
    FormDto addNewProperty(FormDto pdto, MultipartFile file);
}
