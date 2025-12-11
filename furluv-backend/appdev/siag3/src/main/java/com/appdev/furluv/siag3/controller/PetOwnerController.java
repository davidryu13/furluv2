package com.appdev.furluv.siag3.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.furluv.siag3.entity.PetOwner;
import com.appdev.furluv.siag3.service.PetOwnerService;

@RestController
@RequestMapping("/api/petowners")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class PetOwnerController {
    private final PetOwnerService petOwnerService;

    public PetOwnerController(PetOwnerService petOwnerService) {
        this.petOwnerService = petOwnerService;
    }

    @GetMapping
    public List<PetOwner> getAllPetOwners() {
        return petOwnerService.getAllPetOwners();
    }

    @GetMapping("/{id}")
    public PetOwner getPetOwner(@PathVariable Long id) {
        return petOwnerService.getPetOwnerById(id);
    }

    @PostMapping
    public PetOwner createPetOwner(@RequestBody PetOwner petOwner) {
        return petOwnerService.createPetOwner(petOwner);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        PetOwner owner = petOwnerService.getPetOwnerByEmail(email);
        
        if (owner != null && owner.getPassword().equals(password)) {
            // Create response without password
            Map<String, Object> response = new HashMap<>();
            response.put("id", owner.getId());
            response.put("firstName", owner.getFirstName());
            response.put("lastName", owner.getLastName());
            response.put("email", owner.getEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }

    @PutMapping("/{id}")
    public PetOwner updatePetOwner(@PathVariable Long id, @RequestBody PetOwner petOwner) {
        System.out.println("[PetOwnerController] Received update for id=" + id + ", profileImage=" + petOwner.getProfileImage() + ", coverImage=" + petOwner.getCoverImage());
        PetOwner saved = petOwnerService.updatePetOwner(id, petOwner);
        System.out.println("[PetOwnerController] Returning saved owner id=" + saved.getId());
        return saved;
    }
}
