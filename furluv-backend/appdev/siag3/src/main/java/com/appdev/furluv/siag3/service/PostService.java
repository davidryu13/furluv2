package com.appdev.furluv.siag3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.furluv.siag3.entity.Post;
import com.appdev.furluv.siag3.repository.PostRepository;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Post not found with id: " + id));
    }

    public Post createPost(Post post) {
        System.out.println("[PostService] Creating post; imageUrl=" + post.getImageUrl() + ", creatorName=" + post.getCreatorName());
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post updatedPost) {
        Post existingPost = getPostById(id);
        existingPost.setContent(updatedPost.getContent());
        if (updatedPost.getImageUrl() != null) {
            existingPost.setImageUrl(updatedPost.getImageUrl());
        }
        if (updatedPost.getCreatorName() != null) {
            existingPost.setCreatorName(updatedPost.getCreatorName());
        }
        return postRepository.save(existingPost);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
