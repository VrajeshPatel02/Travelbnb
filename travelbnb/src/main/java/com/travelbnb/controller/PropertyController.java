package com.travelbnb.controller;

import com.travelbnb.entity.Property;
import com.travelbnb.entity.User;
import com.travelbnb.payload.FormDto;
import com.travelbnb.payload.PropertyDto;
import com.travelbnb.service.PropertyImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.hateoas.PagedModel;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/api/v1/property", consumes = {"multipart/form-data", "application/octet-stream"})
public class PropertyController {
    @Autowired
    private PropertyImpl property;

//    @PostMapping("/addProperty")
//    public ResponseEntity<?> addProperty(@RequestBody PropertyDto propertyDto) {
//        PropertyDto saved = property.addProperty(propertyDto, propertyDto.getCountry(), propertyDto.getLocation());
//        return new ResponseEntity<>(saved, HttpStatus.CREATED);
//    }

    @PostMapping("/addNewProperty")
    public ResponseEntity<?> addNewProperty(@ModelAttribute FormDto dto,
                                            @RequestParam("file") MultipartFile[] file,
                                            @AuthenticationPrincipal User user) {
        FormDto saved = property.addNewProperty(dto, file, user);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/search/properties")
    public ResponseEntity<?> searchProperties(
            @RequestParam String name
    ) {
        List<PropertyDto> propertyDtos = property.searchProperty(name);
        return new ResponseEntity<>(propertyDtos, HttpStatus.OK);
    }

    @GetMapping("/allProperties")
    public ResponseEntity<PagedModel<EntityModel<PropertyDto>>> getAllProperties(
            @RequestParam(name = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(name = "pageSize", defaultValue = "12", required = false) int pageSize,
            @RequestParam(name = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @AuthenticationPrincipal User user,
            PagedResourcesAssembler<PropertyDto> assembler
    ) {
        Page<PropertyDto> dto = property.getAll(pageSize, pageNo, sortBy, sortDir, user);

        // Convert Page<PropertyDto> into PagedModel
        PagedModel<EntityModel<PropertyDto>> pagedModel = assembler.toModel(dto
        );

        return ResponseEntity.ok(pagedModel);
    }

    @PutMapping("/updateProperty")
    public ResponseEntity<?> updateProperty(@RequestParam PropertyDto dto) {
        PropertyDto updated = property.updatePropertyDetails(dto);
        if (updated == null) {
            return new ResponseEntity<>("Property not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/deleteProperty")
    public ResponseEntity<?> deleteProperty(@RequestParam Long id) {
        boolean b = property.deleteProperty(id);
        if (!b) {
            return new ResponseEntity<>("Success", HttpStatus.OK);
        }
        return new ResponseEntity<>("Property not found", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        PropertyDto p = property.getPropertyById(id);
        return ResponseEntity.ok(p);
    }

}