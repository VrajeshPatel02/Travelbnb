package com.travelbnb.service;

import com.travelbnb.payload.ImageDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    ImageDto uploadImageFile(MultipartFile file, String bucketName, Long propertyId);
    List<String> getImagesByPropertyId(Long propertyId);
    boolean deleteImage(Long imageId, String bucketName,Long propertyId);
}
