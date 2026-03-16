package com.codevspace.backend.controller;

import com.codevspace.backend.dto.ChatMessageRequest;
import com.codevspace.backend.model.ChatMessage;
import com.codevspace.backend.model.User;
import com.codevspace.backend.service.ChatService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{projectId}/chat")
public class ChatController {
    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(@PathVariable String projectId, @RequestBody ChatMessageRequest message, @AuthenticationPrincipal User currentUser){
        return ResponseEntity.ok().body(chatService.sendMessage(projectId,message,currentUser));
    }

    @GetMapping
    public ResponseEntity<List<ChatMessage>> getAllChatHistory(@PathVariable String projectId, @AuthenticationPrincipal User currentUser){
        return ResponseEntity.ok().body(chatService.getChatHistory(projectId,currentUser));
    }

}
