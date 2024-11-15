package com.travelbnb.controller;

import com.travelbnb.entity.User;
import com.travelbnb.payload.ImageDto;
import com.travelbnb.service.BucketService;
import com.travelbnb.service.ImageImpl;
import com.travelbnb.service.PropertyImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/images")
public class ImageController {

    private ImageImpl imageImpl;

    public ImageController(ImageImpl imageImpl) {
        this.imageImpl = imageImpl;
    }

    @PostMapping("/upload/file/{bucketName}/property/{propertyId}")
    public ResponseEntity<ImageDto> uploadFile(@RequestParam MultipartFile file,
                                               @PathVariable String bucketName,
                                               @PathVariable Long propertyId){
//                                        @AuthenticationPrincipal User user){
        ImageDto imageDto = imageImpl.uploadImageFile(file, bucketName, propertyId);
        return new ResponseEntity<>(imageDto, HttpStatus.OK);
    }
}
