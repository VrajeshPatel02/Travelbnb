package com.travelbnb.controller;

import com.travelbnb.service.BucketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/bucket")
public class BucketController {

    @Autowired
    private BucketService service;
    @PostMapping("/upload/file/{bucketName}")
    public ResponseEntity<?> uploadFile(@RequestParam MultipartFile file,
                                        @PathVariable String bucketName){
        return new ResponseEntity<>(service.uploadFile(file, bucketName), HttpStatus.OK);
    }
}
