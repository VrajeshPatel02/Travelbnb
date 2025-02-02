//package com.travelbnb.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//@Getter
//@Setter
//@Entity
//@Table(name = "amenities")
//public class Amenities {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id", nullable = false)
//    private Long id;
//
//    @Column(name = "wifi")
//    private Boolean wifi;
//
//    @Column(name = "pool")
//    private Boolean pool;
//
//    @Column(name = "kitchen")
//    private Boolean kitchen;
//
//    @Column(name = "free_parking")
//    private Boolean freeParking;
//
//    @Column(name = "hot_tub")
//    private Boolean hotTub;
//
//    @Column(name = "air_conditioning")
//    private Boolean airConditioning;
//
//    @Column(name = "heating")
//    private Boolean heating;
//
//    @Column(name = "washing_machine")
//    private Boolean washingMachine;
//
//    @Column(name = "dryer")
//    private Boolean dryer;
//
//    @Column(name = "self_check_in")
//    private Boolean selfCheckIn;
//
//    @Column(name = "tv")
//    private Boolean tv;
//
//    @Column(name = "fireplace")
//    private Boolean fireplace;
//
//    @Column(name = "gym")
//    private Boolean gym;
//
//    @ManyToOne
//    @JoinColumn(name = "property_id")
//    private Property property;
//}