package com.appdev.furluv.siag3.controller;

import com.appdev.furluv.siag3.entity.BreederProfile;
import com.appdev.furluv.siag3.service.BreederProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/breeder-profiles")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class BreederProfileController {
    private final BreederProfileService breederProfileService;

    public BreederProfileController(BreederProfileService breederProfileService) {
        this.breederProfileService = breederProfileService;
    }

    @GetMapping
    public List<BreederProfile> getAllBreederProfiles() {
        return breederProfileService.getAllBreederProfiles();
    }

    @GetMapping("/{id}")
    public BreederProfile getBreederProfile(@PathVariable Long id) {
        return breederProfileService.getBreederProfileById(id);
    }

    @PostMapping
    public BreederProfile createBreederProfile(@RequestBody BreederProfile breederProfile) {
        return breederProfileService.createBreederProfile(breederProfile);
    }

    @PutMapping("/{id}")
    public BreederProfile updateBreederProfile(@PathVariable Long id, @RequestBody BreederProfile breederProfile) {
        return breederProfileService.updateBreederProfile(id, breederProfile);
    }
}
