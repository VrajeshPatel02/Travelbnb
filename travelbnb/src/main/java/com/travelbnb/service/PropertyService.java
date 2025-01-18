package com.travelbnb.service;
import com.travelbnb.entity.User;
import com.travelbnb.payload.FormDto;
import com.travelbnb.payload.PropertyDto;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PropertyService {

    List<PropertyDto> searchProperty(String name);

    PropertyDto addProperty(PropertyDto pdto, long countryId, long locationId);
    boolean deleteProperty(Long id);
    PropertyDto updatePropertyDetails(PropertyDto pdto);

    PropertyDto getPropertyById(Long id, User user);

    Page<PropertyDto> getAll(int pageSize, int pageNo, String sortBy, String sortDir, User user);
    FormDto addNewProperty(FormDto pdto, MultipartFile[] file, User user);

    List<PropertyDto> getHostProperties(User host);
}
