package com.travelbnb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "property")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "no_guests", nullable = false)
    private Integer noGuests;

    @Column(name = "no_bedrooms", nullable = false)
    private Integer no_bedrooms;

    @Column(name = "no_bathrooms", nullable = false)
    private Integer no_bathrooms;

    @Column(name = "price", nullable = false)
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @OneToMany(mappedBy = "property", orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "amenities_id")
    private Amenities amenities;
}