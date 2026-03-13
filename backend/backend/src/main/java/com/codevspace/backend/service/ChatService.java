package com.codevspace.backend.service;

import com.codevspace.backend.dto.ChatMessageRequest;
import com.codevspace.backend.model.ChatMessage;
import com.codevspace.backend.model.Project;
import com.codevspace.backend.model.User;
import com.codevspace.backend.repository.ChatRepository;
import com.codevspace.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final ProjectRepository projectRepository;

    private void verifyProjectAccess(String projectId,String userId) {
        Project project=projectRepository.findById(projectId).orElseThrow(()->new IllegalArgumentException("Project not found") );

        boolean isCollaborator=project.getCollaborators().stream().
                anyMatch(c->c.getUserId().equals(userId));

        if(!isCollaborator){
            throw new SecurityException("You are not collaborator you do not have access to project");
        }
    }

    public ChatMessage sendMessage(String projectId, ChatMessageRequest message, User currentUser){
        verifyProjectAccess(projectId,currentUser.getId());

        ChatMessage chatMessage =ChatMessage.builder()
                .projectId(projectId)
                .senderId(currentUser.getId())
                .senderName(currentUser.getName())
                .content(message.getContent())
                .build();

        return chatRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatHistory(String projectId,User currentUser){
        verifyProjectAccess(projectId,currentUser.getId());

        Sort sortByDate=Sort.by(Sort.Direction.ASC,"createdAt");

        return chatRepository.findByProjectId(projectId,sortByDate);
    }

}
