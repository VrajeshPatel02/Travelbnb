package com.travelbnb.repository;

import com.travelbnb.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    Optional<Favourite> findByPropertyId(Long id);
    @Query(nativeQuery = true, value = "SELECT f.* FROM Favourite f JOIN Property p ON f.property_id = p.id JOIN user_entity u ON f.user_id = u.id WHERE f.property_id = :propertyId AND f.user_id = :userId")
    Optional<Favourite> findFavourites(@Param("userId") Long userId, @Param("propertyId") Long propertyId);

    List<Favourite> findAllByUserId(Long id);
}