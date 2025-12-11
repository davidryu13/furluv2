package com.appdev.furluv.siag3.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PetListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String petName;

    @Column(nullable = false)
    private String breed;

    @Column(nullable = false)
    private int age;

    @Column(nullable = false)
    private String status;

    @Column(length = 255)
    private String creatorName;

    @Column
    private Long creatorId;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Constructors, getters, and setters
    public PetListing() {
    }

    public PetListing(String petName, String breed, int age, String status) {
        this.petName = petName;
        this.breed = breed;
        this.age = age;
        this.status = status;
    }

    public PetListing(String petName, String breed, int age, String status, String creatorName, Long creatorId) {
        this.petName = petName;
        this.breed = breed;
        this.age = age;
        this.status = status;
        this.creatorName = creatorName;
        this.creatorId = creatorId;
    }

    public PetListing(String petName, String breed, int age, String status, String creatorName, Long creatorId, String imageUrl) {
        this.petName = petName;
        this.breed = breed;
        this.age = age;
        this.status = status;
        this.creatorName = creatorName;
        this.creatorId = creatorId;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
