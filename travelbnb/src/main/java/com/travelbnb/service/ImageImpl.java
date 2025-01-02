package com.travelbnb.service;

import com.travelbnb.entity.Image;
import com.travelbnb.entity.Property;
import com.travelbnb.payload.ImageDto;
import com.travelbnb.repository.ImageRepository;
import com.travelbnb.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
@Service
public class ImageImpl implements ImageService{

    private ImageRepository imageRepository;
    private BucketService bucketService;
    private PropertyRepository propertyRepository;

    public ImageImpl(ImageRepository imageRepository, BucketService bucketService, PropertyRepository propertyRepository) {
        this.imageRepository = imageRepository;
        this.bucketService = bucketService;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public ImageDto uploadImageFile(MultipartFile file, String bucketName, Long propertyId) {
        Optional<Property> property = propertyRepository.findById(propertyId);
        if(property.isPresent()){
            String imageUrl = bucketService.uploadFile(file, bucketName);
            Image image = new Image();
            image.setImageUrl(imageUrl);
            image.setProperty(property.get());
            final Image save = imageRepository.save(image);
            ImageDto imageDto = new ImageDto();
            imageDto.setId(save.getId());
            imageDto.setImageUrl(save.getImageUrl());
            imageDto.setProperty_id(save.getProperty().getId());
            return imageDto;
        }

        return null;
    }

    @Override
    public List<String> getImagesByPropertyId(Long propertyId) {
        List<Image> all = imageRepository.findAllByPropertyId(propertyId);
        return all.stream().map(Image::getImageUrl).toList();
    }
}
