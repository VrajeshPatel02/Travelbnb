package com.travelbnb.repository;

import com.travelbnb.entity.Amenities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AmenitiesRepository extends JpaRepository<Amenities, Long> {
    @Query(value = "SELECT  a.* FROM Amenities a JOIN Property p ON a.property_id = p.id WHERE a.property_id =:propertyId", nativeQuery = true)
    Amenities findByProperty(@Param("propertyId") Long propertyId);
}