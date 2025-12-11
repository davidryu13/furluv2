package com.appdev.furluv.siag3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.furluv.siag3.entity.PetOwner;
import com.appdev.furluv.siag3.repository.PetOwnerRepository;

@Service
public class PetOwnerService {
    @Autowired
    private PetOwnerRepository pRepo;

    //C - Create
    public PetOwner createPetOwner(PetOwner petOwner) {
        return pRepo.save(petOwner);
    }

    //R - Read
    public PetOwner getPetOwnerById(Long id) {
        return pRepo.findById(id).orElse(null);
    }

    public PetOwner getPetOwnerByEmail(String email) {
        return pRepo.findByEmail(email).orElse(null);
    }

    public List<PetOwner> getAllPetOwners() {
        return pRepo.findAll();
    }

    //U - Update
    public PetOwner updatePetOwner(Long id, PetOwner newPetOwner) {
        PetOwner petOwner = new PetOwner();
        try{
            petOwner = pRepo.findById(id).get();
            System.out.println("[PetOwnerService] Updating owner id=" + id + "; incoming profileImage=" + newPetOwner.getProfileImage() + ", coverImage=" + newPetOwner.getCoverImage());
            petOwner.setFirstName(newPetOwner.getFirstName());  
            petOwner.setLastName(newPetOwner.getLastName());
            petOwner.setEmail(newPetOwner.getEmail());
            petOwner.setPassword(newPetOwner.getPassword());
            if (newPetOwner.getProfileImage() != null) {
                petOwner.setProfileImage(newPetOwner.getProfileImage());
            }
            if (newPetOwner.getCoverImage() != null) {
                petOwner.setCoverImage(newPetOwner.getCoverImage());
            }
            PetOwner saved = pRepo.save(petOwner);
            System.out.println("[PetOwnerService] Saved owner id=" + saved.getId() + "; profileImage=" + saved.getProfileImage() + ", coverImage=" + saved.getCoverImage());
            return saved;
        }catch(NoSuchElementException e) {
            throw new NoSuchElementException("Pet with ID " + id + " not found.");
        }finally{
            return pRepo.save(petOwner);
        }
    }

    //D - Delete
    public String deletePetOwner(Long id) {
        String msg = "";
        if(pRepo.findById(id) != null){
            msg = "Pet with ID " + id + " deleted successfully.";
            pRepo.deleteById(id);
        } else{
            msg = "Pet with ID " + id + " does not exist.";
        }
        return msg;
    }

}
