package com.travelbnb.repository;

import com.travelbnb.entity.Property;
import com.travelbnb.entity.Review;
import com.travelbnb.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewsRepository extends JpaRepository<Review, Long> {

    @Query(value="SELECT r.* FROM Review r WHERE r.user_id=:userId AND r.property_id=:propertyId", nativeQuery = true)
    Review findByReviewUser(@Param("userId")Long userId,@Param("propertyId") Long propertyId);

    Page<Review> findByUser(User user, PageRequest pageable);
}