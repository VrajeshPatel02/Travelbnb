package com.travelbnb.service;

import com.travelbnb.payload.ImageDto;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    ImageDto uploadImageFile(MultipartFile file, String bucketName, Long propertyId);
}
