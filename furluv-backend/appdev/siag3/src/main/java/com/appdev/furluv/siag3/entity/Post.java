package com.appdev.furluv.siag3.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 5000)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(length = 255)
    private String creatorName;

    // Constructors, getters, and setters

    public Post() {
    }

    public Post(String content) {
        this.content = content;
    }

    public Post(String content, String imageUrl) {
        this.content = content;
        this.imageUrl = imageUrl;
    }

    public Post(String content, String imageUrl, String creatorName) {
        this.content = content;
        this.imageUrl = imageUrl;
        this.creatorName = creatorName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }
}
