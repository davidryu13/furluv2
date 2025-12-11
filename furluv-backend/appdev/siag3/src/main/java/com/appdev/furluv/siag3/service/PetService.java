package com.appdev.furluv.siag3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.furluv.siag3.entity.Pet;
import com.appdev.furluv.siag3.repository.PetRepository;

@Service
public class PetService {
    @Autowired
    private PetRepository pRepo;

    //C - Create
    public Pet createPet(Pet pet) {
        System.out.println("[PetService] Creating pet; imageUrl=" + pet.getImageUrl());
        return pRepo.save(pet);
    }

    //R - Read
    public Pet getPetById(Long id) {
        return pRepo.findById(id).orElse(null);
    }

    public List<Pet> getAllPets() {
        return pRepo.findAll();
    }

    //U - Update
    public Pet updatePet(Long id, Pet newPet) {
        Pet pet = new Pet();
        try{
            pet = pRepo.findById(id).get();
            System.out.println("[PetService] Updating pet id=" + id + "; new imageUrl=" + newPet.getImageUrl());
            pet.setName(newPet.getName());
            pet.setType(newPet.getType());
            pet.setBreed(newPet.getBreed());
            pet.setAge(newPet.getAge());
            pet.setBio(newPet.getBio());
            pet.setDocuments(newPet.getDocuments());
            if (newPet.getImageUrl() != null) {
                pet.setImageUrl(newPet.getImageUrl());
            }
            return pRepo.save(pet);
        }catch(NoSuchElementException e) {
            throw new NoSuchElementException("Pet with ID " + id + " not found.");
        }finally{
            return pRepo.save(pet);
        }
    }

    //D - Delete
    public String deletePet(Long id) {
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
