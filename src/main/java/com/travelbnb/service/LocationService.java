package com.travelbnb.service;

import com.travelbnb.payload.LocationDto;

public interface LocationService {
    LocationDto addLocation(LocationDto dto);
    boolean removeLocation(String name);
    LocationDto updateLocation(LocationDto dto);
    LocationDto getLocation(String name);
}
