package com.travelbnb.controller;

import com.travelbnb.payload.FormDto;
import com.travelbnb.payload.PropertyDto;
import com.travelbnb.service.PropertyImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/property", consumes = {"multipart/form-data", "application/octet-stream"})
public class PropertyController {
    @Autowired
    private PropertyImpl property;

    @PostMapping("/addProperty")
    public ResponseEntity<?> addProperty(@RequestBody PropertyDto propertyDto) {
        PropertyDto saved = property.addProperty(propertyDto, propertyDto.getCountry(), propertyDto.getLocation());
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/addNewProperty")
    public ResponseEntity<?> addNewProperty(@ModelAttribute PropertyDto dto,
                                            @RequestParam("file") MultipartFile file) {
        FormDto saved = property.addNewProperty(dto, file);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/search/properties")
    public ResponseEntity<?> searchProperties(
            @RequestParam String name,
    @RequestParam(name="pageSize", defaultValue="10", required=false) int pageSize,
    @RequestParam(name="pageNo", defaultValue="0", required=false) int pageNo,
    @RequestParam(name="sortBy", defaultValue="id", required=false) String sortBy,
    @RequestParam(name="sortDir", defaultValue="asc", required=false) String sortDir
    ) {
        List<PropertyDto> propertyDtos = property.searchProperty(name, pageSize, pageNo, sortBy, sortDir);
        return new ResponseEntity<>(propertyDtos, HttpStatus.OK);
    }
    @GetMapping("/allProperties")
    public ResponseEntity<?> getAllProperties(
            @RequestParam(name="pageSize", defaultValue="10", required=false) int pageSize,
            @RequestParam(name="pageNo", defaultValue="0", required=false) int pageNo,
            @RequestParam(name="sortBy", defaultValue="id", required=false) String sortBy,
            @RequestParam(name="sortDir", defaultValue="asc", required=false) String sortDir
            )
    {
        List<PropertyDto> dto = property.getAll(pageSize,pageNo, sortBy, sortDir);
        return new ResponseEntity<>(dto,HttpStatus.OK);
    }
    @PutMapping("/updateProperty")
    public ResponseEntity<?> updateProperty(@RequestParam PropertyDto dto){
        PropertyDto updated = property.updatePropertyDetails(dto);
        if(updated == null){
            return new ResponseEntity<>("Property not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    @DeleteMapping("/deleteproperty")
    public ResponseEntity<?> deleteProperty(@RequestParam Long id){
        boolean b = property.deleteProperty(id);
        if(!b){
            return new ResponseEntity<>("Success", HttpStatus.OK);
        }
        return new ResponseEntity<>("Property not found", HttpStatus.NOT_FOUND);
    }
}
