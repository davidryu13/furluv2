package com.appdev.furluv.siag3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.furluv.siag3.entity.Pet;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    // Additional query methods can be defined here if needed

}
