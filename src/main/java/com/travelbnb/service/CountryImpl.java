package com.travelbnb.service;

import com.travelbnb.entity.Country;
import com.travelbnb.payload.CountryDto;
import com.travelbnb.repository.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CountryImpl implements CountryService{
    private CountryRepository countryRepository;

    public CountryImpl(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @Override
    public CountryDto addCountry(CountryDto country) {
        Country entity = DtoToEntity(country);
        CountryDto dto = EntityToDto(entity);
        Country saved = countryRepository.save(entity);
        return dto;
    }

    @Override
    public boolean deleteCountryDetails(String name) {
        Optional<Country> byName = countryRepository.findByName(name);
        if(byName.isPresent()){
            countryRepository.delete(byName.get());
            return true;
        }
        return false;
    }

    @Override
    public CountryDto getCountryByName(String name) {
        Optional<Country> byName = countryRepository.findByName(name);
        if(byName.isPresent()) {
            CountryDto Dto = EntityToDto(byName.get());
            return Dto;
        }
        return null;
    }

    @Override
    public CountryDto updateCountry(CountryDto country) {
        Optional<Country> opCountry = countryRepository.findByName(country.getName());
        if(opCountry.isPresent()){
            Country entity = DtoToEntity(country);
            CountryDto dto = EntityToDto(entity);
            countryRepository.save(entity);
            return dto;
        }
        return null;
    }

    public Country DtoToEntity(CountryDto dto){
        Country entity = new Country();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        return entity;
    }

    public CountryDto EntityToDto(Country entity){
        CountryDto dto = new CountryDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        return dto;
    }
}
