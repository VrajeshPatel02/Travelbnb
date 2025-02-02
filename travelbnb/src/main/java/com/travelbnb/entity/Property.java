package com.travelbnb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @ElementCollection
    @CollectionTable(name = "property_facilities",
            joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "facility")
    private Set<String> facilities = new HashSet<>();

//    @ManyToOne
//    @JoinColumn(name = "amenities_id")
//    private Amenities amenities;
}