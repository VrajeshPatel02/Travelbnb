package com.travelbnb.repository;

import com.travelbnb.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByPropertyId(Long id);

    List<Image> findAllByPropertyId(Long id);
}