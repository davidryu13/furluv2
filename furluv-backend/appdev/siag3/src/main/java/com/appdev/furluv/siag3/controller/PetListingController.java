package com.appdev.furluv.siag3.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.furluv.siag3.entity.PetListing;
import com.appdev.furluv.siag3.service.PetListingService;

@RestController
@RequestMapping("/api/pet-listings")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class PetListingController {
    private final PetListingService petListingService;

    public PetListingController(PetListingService petListingService) {
        this.petListingService = petListingService;
    }

    @GetMapping
    public List<PetListing> getAllPetListings() {
        return petListingService.getAllPetListings();
    }

    @GetMapping("/{id}")
    public PetListing getPetListing(@PathVariable Long id) {
        return petListingService.getPetListingById(id);
    }

    @PostMapping
    public PetListing createPetListing(@RequestBody PetListing petListing) {
        System.out.println("[PetListingController] createPetListing received; creatorName=" + petListing.getCreatorName() + ", creatorId=" + petListing.getCreatorId() + ", imageUrl=" + petListing.getImageUrl());
        PetListing saved = petListingService.createPetListing(petListing);
        System.out.println("[PetListingController] Saved listing id=" + saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    public PetListing updatePetListing(@PathVariable Long id, @RequestBody PetListing petListing) {
        return petListingService.updatePetListing(id, petListing);
    }

    @DeleteMapping("/{id}")
    public void deletePetListing(@PathVariable Long id) {
        petListingService.deletePetListing(id);
    }
}
