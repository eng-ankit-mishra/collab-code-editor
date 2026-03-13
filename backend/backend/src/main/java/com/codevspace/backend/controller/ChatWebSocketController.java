package com.codevspace.backend.controller;

import com.codevspace.backend.dto.ChatMessageRequest;
import com.codevspace.backend.model.ChatMessage;
import com.codevspace.backend.model.User;
import com.codevspace.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;


@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
    private final ChatService chatService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat/{projectId}/sendMessage")
    public void processMessage(@DestinationVariable String projectId, @Payload ChatMessageRequest request, Authentication authentication){
        User currentUser=(User) authentication.getPrincipal();

        ChatMessage savedMessage=chatService.sendMessage(projectId,request,currentUser);

        simpMessagingTemplate.convertAndSend("/topic/projects/" +  projectId, savedMessage);


    }

}
