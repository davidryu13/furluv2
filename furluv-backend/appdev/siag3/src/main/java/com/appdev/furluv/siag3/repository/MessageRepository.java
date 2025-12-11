package com.appdev.furluv.siag3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appdev.furluv.siag3.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByIdAsc(String conversationId);
}
