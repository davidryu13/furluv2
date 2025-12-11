package com.appdev.furluv.siag3.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class BreederProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String breederName;

    @Column(nullable = false)
    private String location;

    private String documents;
    // Constructors, getters, and setters
    public BreederProfile() {
    }

    public BreederProfile(String breederName, String location, String contactInfo) {
        this.breederName = breederName;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBreederName() {
        return breederName;
    }

    public void setBreederName(String breederName) {
        this.breederName = breederName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDocuments() {
        return documents;
    }

    public void setDocuments(String documents) {
        this.documents = documents;
    }
}
