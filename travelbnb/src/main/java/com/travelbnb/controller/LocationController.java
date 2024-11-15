package com.travelbnb.controller;

import com.travelbnb.payload.LocationDto;
import com.travelbnb.service.LocationImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/Locations")

public class LocationController {
    private LocationImpl location;
    public LocationController(LocationImpl location) {
        this.location = location;
    }
    @PostMapping("/addLocation")
    public ResponseEntity<?> addLocation(@RequestBody LocationDto ldto) {
        LocationDto saved = location.addLocation(ldto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    @PutMapping("/updateLocation")
    public ResponseEntity<?> updateLocation(@RequestBody LocationDto ldto){
        LocationDto updated = location.updateLocation(ldto);
        if(updated!= null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        return new ResponseEntity<>("Location Not Found", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteLocation(@RequestParam String name){
        boolean val = location.removeLocation(name);
        if(val) {
            return new ResponseEntity<>("success",HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>("Location Not Found", HttpStatus.NOT_FOUND);
    }
    @GetMapping("/getLocation")
    public ResponseEntity<?> getLocation(@RequestParam String name){
        LocationDto locationDetails = location.getLocation(name);
        if(locationDetails == null){
            return new ResponseEntity<>("Location Not Found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(locationDetails, HttpStatus.OK);
    }
}
