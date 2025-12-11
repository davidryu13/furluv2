package com.appdev.furluv.siag3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.furluv.siag3.entity.BreederProfile;
import com.appdev.furluv.siag3.repository.BreederProfileRepository;

@Service
public class BreederProfileService {
    @Autowired
    private BreederProfileRepository breederProfileRepository;

    public List<BreederProfile> getAllBreederProfiles() {
        return breederProfileRepository.findAll();
    }

    public BreederProfile getBreederProfileById(Long id) {
        return breederProfileRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("BreederProfile not found with id: " + id));
    }

    public BreederProfile createBreederProfile(BreederProfile breederProfile) {
        return breederProfileRepository.save(breederProfile);
    }

    public BreederProfile updateBreederProfile(Long id, BreederProfile updatedBreederProfile) {
        BreederProfile existingBreederProfile = getBreederProfileById(id);
        existingBreederProfile.setBreederName(updatedBreederProfile.getBreederName());
        existingBreederProfile.setLocation(updatedBreederProfile.getLocation());
        return breederProfileRepository.save(existingBreederProfile);
    }

    public void deleteBreederProfile(Long id) {
        breederProfileRepository.deleteById(id);
    }
}
