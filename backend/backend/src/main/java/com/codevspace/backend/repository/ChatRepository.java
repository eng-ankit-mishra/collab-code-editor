package com.codevspace.backend.repository;

import com.codevspace.backend.model.ChatMessage;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByProjectId(String projectId, Sort sort);
}
