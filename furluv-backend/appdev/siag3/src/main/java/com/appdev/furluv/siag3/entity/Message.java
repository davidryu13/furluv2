package com.appdev.furluv.siag3.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String conversationId;

    // Optional human readable label for the conversation (e.g. "Owner of Fido")
    private String conversationLabel;

    // Sender identifier (email or pseudo-id)
    private String sender;

    // Optional sender display name
    private String senderName;

    // Message body
    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    // ISO timestamp string
    private String timestamp;

    public Message() {}

    public Message(String conversationId, String conversationLabel, String sender, String senderName, String text, String timestamp) {
        this.conversationId = conversationId;
        this.conversationLabel = conversationLabel;
        this.sender = sender;
        this.senderName = senderName;
        this.text = text;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getConversationLabel() {
        return conversationLabel;
    }

    public void setConversationLabel(String conversationLabel) {
        this.conversationLabel = conversationLabel;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
