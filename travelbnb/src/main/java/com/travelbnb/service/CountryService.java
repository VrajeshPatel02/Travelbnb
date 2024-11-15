package com.travelbnb.service;

import com.travelbnb.payload.CountryDto;

public interface CountryService {
    CountryDto addCountry(CountryDto country);
    boolean deleteCountryDetails(String name);
    CountryDto getCountryByName(String name);
    CountryDto updateCountry(CountryDto country);
}
