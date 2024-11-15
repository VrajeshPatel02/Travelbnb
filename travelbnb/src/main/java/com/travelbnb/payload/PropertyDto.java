package com.travelbnb.payload;

import com.travelbnb.entity.Country;
import com.travelbnb.entity.Location;

public class PropertyDto {
    private Long id;
    private String name;
    private Integer noGuests;
    private Integer no_bedrooms;
    private Integer no_bathrooms;
    private Integer price;
    private Long country;
    private Long location;

    public Long getCountry() {
        return country;
    }

    public void setCountry(Long country) {
        this.country = country;
    }

    public Long getLocation() {
        return location;
    }

    public void setLocation(Long location) {
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getNoGuests() {
        return noGuests;
    }

    public void setNoGuests(Integer noGuests) {
        this.noGuests = noGuests;
    }

    public Integer getNo_bedrooms() {
        return no_bedrooms;
    }

    public void setNo_bedrooms(Integer no_bedrooms) {
        this.no_bedrooms = no_bedrooms;
    }

    public Integer getNo_bathrooms() {
        return no_bathrooms;
    }

    public void setNo_bathrooms(Integer no_bathrooms) {
        this.no_bathrooms = no_bathrooms;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}
