package com.travelbnb.repository;

import com.travelbnb.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    @Query(value = "SELECT p.* FROM Property p JOIN Location l ON p.location_id = l.id JOIN Country c on p.country_id=c.id WHERE l.name = :locationName or c.name = :locationName", nativeQuery = true)
    Page<Property> searchProperty(@Param("locationName") String locationName, PageRequest pageable);

    Optional<Property> findByName(String name);
}