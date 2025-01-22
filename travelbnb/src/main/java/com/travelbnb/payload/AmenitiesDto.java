package com.travelbnb.payload;

import com.travelbnb.entity.Property;
import lombok.Data;

@Data
public class AmenitiesDto {
    private Long id;
    private Boolean wifi;
    private Boolean pool;
    private Boolean kitchen;
    private Boolean freeParking;
    private Boolean hotTub;
    private Boolean airConditioning;
    private Boolean heating;
    private Boolean washingMachine;
    private Boolean dryer;
    private Boolean selfCheckIn;
    private Boolean tv;
    private Boolean fireplace;
    private Boolean gym;
    private Long property;
}
