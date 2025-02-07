package com.travelbnb.repository;

import com.travelbnb.entity.Booking;
import com.travelbnb.entity.Property;
import com.travelbnb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByProperty(Property property);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.property.id = :propertyId " +
            "AND ((:checkIn BETWEEN b.checkIn AND b.checkOut) " +
            "OR (:checkOut BETWEEN b.checkIn AND b.checkOut) " +
            "OR (b.checkIn BETWEEN :checkIn AND :checkOut))")
    boolean existsByPropertyAndOverlappingDates(
            @Param("propertyId") Long propertyId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.property.id = :propertyId " +
           "AND ((:checkIn BETWEEN b.checkIn AND b.checkOut) " +
           "OR (:checkOut BETWEEN b.checkIn AND b.checkOut) " +
           "OR (b.checkIn BETWEEN :checkIn AND :checkOut))")
    long countOverlappingBookings(
            @Param("propertyId") Long propertyId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

}