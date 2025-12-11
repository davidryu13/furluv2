package com.appdev.furluv.siag3.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.furluv.siag3.entity.Pet;
import com.appdev.furluv.siag3.service.PetService;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/{id}")
    public Pet getPet(@PathVariable Long id) {
        return petService.getPetById(id);
    }

    @PostMapping
    public Pet createPet(@RequestBody java.util.Map<String, Object> body) {
        Pet pet = new Pet();
        if (body.get("name") != null) pet.setName(body.get("name").toString());
        if (body.get("type") != null) pet.setType(body.get("type").toString());
        if (body.get("breed") != null) pet.setBreed(body.get("breed").toString());
        if (body.get("age") != null) pet.setAge(Integer.parseInt(body.get("age").toString()));
        if (body.get("bio") != null) pet.setBio(body.get("bio").toString());
        if (body.get("documents") != null) pet.setDocuments(body.get("documents").toString());

        // accept either 'imageUrl' or 'image' from frontend
        Object img = body.get("imageUrl");
        if (img == null) img = body.get("image");
        System.out.println("[PetController] createPet received image value: " + img);
        if (img != null) pet.setImageUrl(img.toString());

        return petService.createPet(pet);
    }

    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody java.util.Map<String, Object> body) {
        Pet newPet = new Pet();
        if (body.get("name") != null) newPet.setName(body.get("name").toString());
        if (body.get("type") != null) newPet.setType(body.get("type").toString());
        if (body.get("breed") != null) newPet.setBreed(body.get("breed").toString());
        if (body.get("age") != null) newPet.setAge(Integer.parseInt(body.get("age").toString()));
        if (body.get("bio") != null) newPet.setBio(body.get("bio").toString());
        if (body.get("documents") != null) newPet.setDocuments(body.get("documents").toString());
        Object img = body.get("imageUrl");
        if (img == null) img = body.get("image");
        System.out.println("[PetController] updatePet id=" + id + " received image value: " + img);
        if (img != null) newPet.setImageUrl(img.toString());

        return petService.updatePet(id, newPet);
    }
}