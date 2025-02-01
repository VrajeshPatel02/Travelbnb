package com.travelbnb.controller;

import com.travelbnb.payload.AmenitiesDto;
import com.travelbnb.service.AmenitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/amenites")
public class AmenitiesController {
    @Autowired
    private AmenitiesService amenitiesService;
    @PostMapping("/addAmenities/{propertyId}")
    public ResponseEntity<?> addAmenities(@RequestBody AmenitiesDto adto, @PathVariable Long propertyId) {
        try {
            AmenitiesDto amenitiesDto = amenitiesService.addAmenities(adto, propertyId);
            return new ResponseEntity<>(amenitiesDto, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PutMapping("/updateAmenites/{propertyId}")
    public ResponseEntity<?> updateAmenities(@PathVariable Long propertyId, @RequestBody AmenitiesDto adto) {
        try {
            AmenitiesDto amenitiesDto = amenitiesService.updateAmenities( adto, propertyId);
            return new ResponseEntity<>(amenitiesDto, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/getAmenitiesByProperty/{propertyId}")
    public ResponseEntity<?> getAmenitiesByProperty(@PathVariable Long propertyId) {
        try {
            AmenitiesDto amenitiesDto = amenitiesService.getAmenitiesByProperty(propertyId);
            return new ResponseEntity<>(amenitiesDto, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
