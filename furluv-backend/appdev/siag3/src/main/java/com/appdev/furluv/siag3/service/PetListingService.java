package com.appdev.furluv.siag3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.furluv.siag3.entity.PetListing;
import com.appdev.furluv.siag3.repository.PetListingRepository;

@Service
public class PetListingService {
    @Autowired
    private PetListingRepository petListingRepository;

    public List<PetListing> getAllPetListings() {
        return petListingRepository.findAll();
    }

    public PetListing getPetListingById(Long id) {
        return petListingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("PetListing not found with id: " + id));
    }

    public PetListing createPetListing(PetListing petListing) {
        System.out.println("[PetListingService] Creating listing; creatorName=" + petListing.getCreatorName() + ", creatorId=" + petListing.getCreatorId() + ", imageUrl=" + petListing.getImageUrl());
        return petListingRepository.save(petListing);
    }

    public void deletePetListing(Long id) {
        petListingRepository.deleteById(id);
    }

    public PetListing updatePetListing(Long id, PetListing updatedPetListing) {
        PetListing existingPetListing = petListingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("PetListing not found with id: " + id));

        existingPetListing.setPetName(updatedPetListing.getPetName());
        existingPetListing.setBreed(updatedPetListing.getBreed());
        existingPetListing.setAge(updatedPetListing.getAge());
        existingPetListing.setStatus(updatedPetListing.getStatus());
        if (updatedPetListing.getCreatorName() != null) {
            existingPetListing.setCreatorName(updatedPetListing.getCreatorName());
        }
        if (updatedPetListing.getCreatorId() != null) {
            existingPetListing.setCreatorId(updatedPetListing.getCreatorId());
        }
        if (updatedPetListing.getImageUrl() != null) {
            existingPetListing.setImageUrl(updatedPetListing.getImageUrl());
        }

        return petListingRepository.save(existingPetListing);
    }
}
