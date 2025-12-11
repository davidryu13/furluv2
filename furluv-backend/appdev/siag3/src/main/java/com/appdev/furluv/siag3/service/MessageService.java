package com.appdev.furluv.siag3.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.furluv.siag3.entity.Message;
import com.appdev.furluv.siag3.repository.MessageRepository;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getMessagesByConversationId(String conversationId) {
        return messageRepository.findByConversationIdOrderByIdAsc(conversationId);
    }

    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Map<String, Object>> getAllConversationsSummary() {
        List<Message> all = messageRepository.findAll();
        // Group by conversationId and pick last message
        Map<String, Map<String, Object>> map = new LinkedHashMap<>();
        for (Message m : all) {
            String cid = m.getConversationId();
            Map<String, Object> cur = map.get(cid);
            if (cur == null) {
                cur = new HashMap<>();
                cur.put("conversationId", cid);
                cur.put("conversationLabel", m.getConversationLabel());
                cur.put("lastMessage", m.getText());
                cur.put("lastTimestamp", m.getTimestamp());
                map.put(cid, cur);
            } else {
                // update last message if this one is newer (use id order)
                Long existingLastId = (Long) cur.getOrDefault("lastId", 0L);
                if (m.getId() != null && m.getId() > existingLastId) {
                    cur.put("lastMessage", m.getText());
                    cur.put("lastTimestamp", m.getTimestamp());
                }
            }
            cur.put("lastId", m.getId());
        }

        return new ArrayList<>(map.values());
    }
}
