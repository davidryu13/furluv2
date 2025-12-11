package com.appdev.furluv.siag3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.furluv.siag3.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

}
