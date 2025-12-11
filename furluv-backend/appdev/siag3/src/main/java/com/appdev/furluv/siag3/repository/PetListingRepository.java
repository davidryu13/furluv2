package com.appdev.furluv.siag3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.furluv.siag3.entity.PetListing;

@Repository
public interface PetListingRepository extends JpaRepository<PetListing, Long> {

}
