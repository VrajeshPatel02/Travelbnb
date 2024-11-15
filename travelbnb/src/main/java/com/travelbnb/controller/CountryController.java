package com.travelbnb.controller;

import com.travelbnb.payload.CountryDto;
import com.travelbnb.service.CountryImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/country")
public class CountryController {
    private CountryImpl country;
    public CountryController(CountryImpl country) {
        this.country = country;
    }
    @PostMapping("/addCountry")
    public ResponseEntity<?> addCountry(@RequestBody CountryDto cdto){
        CountryDto saved = country.addCountry(cdto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateCountry(@RequestBody CountryDto cdto){
        CountryDto updated = country.updateCountry(cdto);
        if(updated == null){
            return new ResponseEntity<>("Country not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    @DeleteMapping("delete")
    public ResponseEntity<?> deleteCountry(@RequestParam String name){
        boolean deleted = country.deleteCountryDetails(name);
        if(!deleted){
            return new ResponseEntity<>("Country not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Country deleted successfully", HttpStatus.OK);
    }
    @GetMapping("/getCountry")
    public ResponseEntity<?> getCountry(String name){
        CountryDto countryDto = country.getCountryByName(name);
        if(countryDto == null){
            return new ResponseEntity<>("Country not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(countryDto, HttpStatus.OK);
    }

}
