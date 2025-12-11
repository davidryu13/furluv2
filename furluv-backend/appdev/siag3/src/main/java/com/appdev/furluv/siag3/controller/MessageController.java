package com.appdev.furluv.siag3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.furluv.siag3.entity.Message;
import com.appdev.furluv.siag3.service.MessageService;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://127.0.0.1:5173")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/conversation/{conversationId}")
    public List<Message> getConversation(@PathVariable String conversationId) {
        return messageService.getMessagesByConversationId(conversationId);
    }

    @GetMapping("/conversations")
    public List<Map<String, Object>> getConversations() {
        return messageService.getAllConversationsSummary();
    }

    @PostMapping
    public Message postMessage(@RequestBody Message message) {
        return messageService.createMessage(message);
    }
}
