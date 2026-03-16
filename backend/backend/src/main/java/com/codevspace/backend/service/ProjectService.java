package com.codevspace.backend.service;

import com.codevspace.backend.dto.InvitationResponse;
import com.codevspace.backend.dto.InviteCollaboratorRequest;
import com.codevspace.backend.dto.ProjectCreateRequest;
import com.codevspace.backend.dto.ProjectDashboardResponse;
import com.codevspace.backend.model.Collaborator;
import com.codevspace.backend.model.Project;
import com.codevspace.backend.model.User;
import com.codevspace.backend.model.enums.CollaboratorStatus;
import com.codevspace.backend.model.enums.ProjectRole;
import com.codevspace.backend.repository.ProjectRepository;
import com.codevspace.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public Project createProject(ProjectCreateRequest request, User currentUser) {
        Collaborator collaborator = Collaborator.builder()
                .userId(currentUser.getId())
                .role(ProjectRole.OWNER)
                .build();

        Project project=Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .language(request.getLanguage())
                .codeContent(request.getCodeContent())
                .collaborators(List.of(collaborator))
                .build();

        return projectRepository.save(project);
    }

    public List<Project> getProject(String userId){
        return projectRepository.findByCollaboratorsUserId(userId);
    }

    public Project addCollaborator(String projectId, InviteCollaboratorRequest request,User currentUser){
        Project project=projectRepository.findById(projectId).orElseThrow(()->new IllegalArgumentException("Project not found"));

        boolean isOwner=project.getCollaborators().
                stream().
                anyMatch(c->c.getUserId().equals(currentUser.getId()) && c.getRole().equals(ProjectRole.OWNER));

        if(!isOwner){
            throw new SecurityException("Project not found");
        }

        User invitee=userRepository.findByEmail(request.getEmail()).orElseThrow(()->new IllegalArgumentException("User with this email does not exist not found"));

        boolean alreadyInProject=project.getCollaborators().stream()
                .anyMatch(c->c.getUserId().equals(invitee.getId()));

        if(alreadyInProject){
            throw new IllegalArgumentException("User with this email already exists");
        }

        Collaborator collaborator=Collaborator.builder()
                .userId(invitee.getId())
                .role(request.getRole())
                .build();

        project.getCollaborators().add(collaborator);

        return projectRepository.save(project);

    }

    public List<ProjectDashboardResponse> getDashboardProjects(String userId){
        List<Project> projects=projectRepository.findByCollaboratorsUserId(userId);

        return projects.stream().filter(project -> project.getCollaborators().stream()
                .anyMatch(c -> c.getUserId().equals(userId) && c.getStatus() == CollaboratorStatus.ACCEPTED)).map(project->{
            Collaborator userCollab=project.getCollaborators().stream()
                    .filter(c->c.getUserId().equals(userId))
                    .findFirst()
                    .orElseThrow();
            String permissionText=userCollab.getRole().name().charAt(0) + userCollab.getRole().name().substring(1).toLowerCase();
            String ownershipStatus=userCollab.getRole()==ProjectRole.OWNER ? "Created by You" : "Shared with You";

            return ProjectDashboardResponse.builder()
                    .Id(project.getId())
                    .name(project.getName())
                    .language(project.getLanguage())
                    .permission(permissionText)
                    .ownershipStatus(ownershipStatus)
                    .updatedAt(project.getUpdatedAt())
                    .build();

        }).collect(Collectors.toList());
    }

    public void saveCode(String projectId,String newCode,User currentUser){
        Project project=projectRepository.findById(projectId).orElseThrow(()->new IllegalArgumentException("Project Not Found"));

        boolean canEdit=project.getCollaborators().stream().
                anyMatch(c->c.getUserId().equals(currentUser.getId()) && (c.getRole()==ProjectRole.OWNER || c.getRole()==ProjectRole.EDITOR))
                ;

        if(!canEdit){
            throw new SecurityException("You are Not Allowed to Edit this Project");
        }

        project.setCodeContent(newCode);

        projectRepository.save(project);

    }

    public void inviteCollaborator(String projectId,InviteCollaboratorRequest request,User currentUser){
        Project project=projectRepository.findById(projectId).
                orElseThrow(()->new IllegalArgumentException("Project Not Found"));

        User user=userRepository.findByEmail(request.getEmail()).orElseThrow(()->new SecurityException("User with email does not exist."));

        boolean isOwner=project.getCollaborators().stream().anyMatch(c->c.getUserId().equals(currentUser.getId()) && c.getRole().equals(ProjectRole.OWNER));

        if(!isOwner){
            throw new SecurityException("Only owners can invite collaborators");
        }
        if(project.getCollaborators().stream().anyMatch(c->c.getUserId().equals(user.getId()))) {
            throw new IllegalArgumentException("User with this email already invited");
        }

        Collaborator newCollaborator=Collaborator.builder()
                .userId(user.getId())
                .role(request.getRole())
                .status(CollaboratorStatus.PENDING)
                .invitedByName(currentUser.getName())
                .build();

        project.getCollaborators().add(newCollaborator);

        projectRepository.save(project);

        emailService.sendInviteRequest(request.getEmail(), project.getName(), currentUser.getName());
    }

    public List<InvitationResponse> getMyInvitation(String userId){
        List<Project> projects=projectRepository.findByCollaboratorsUserId(userId);

        return projects.stream()
                .filter(p->p.getCollaborators().stream().anyMatch(c->c.getUserId().equals(userId) && c.getStatus()==(CollaboratorStatus.ACCEPTED)))
                .map(p->{
                    Collaborator collab=p.getCollaborators().stream().filter(c->c.getUserId().equals(userId)).findFirst().orElseThrow();

                    String permissionText=collab.getRole()==ProjectRole.EDITOR ? "Can Edit" : "Can View";

                    return InvitationResponse.builder()
                            .projectName(p.getName())
                            .language(p.getLanguage())
                            .projectId(p.getId())
                            .permission(permissionText)
                            .invitedBy(collab.getInvitedByName())
                            .build();

                }).toList();
    }

    public void respondToInvitation(String projectId,String userId,boolean accept){
        Project project=projectRepository.findById(projectId).orElseThrow(()->new IllegalArgumentException("Project Not Found"));

        Collaborator myCollab=project.getCollaborators().stream().filter(c->c.getUserId().equals(userId) && c.getStatus()==CollaboratorStatus.PENDING).findFirst().orElseThrow(()->new IllegalArgumentException("No pending request found for this project"));

        if(accept){
            myCollab.setStatus(CollaboratorStatus.ACCEPTED);
        }else{
            project.getCollaborators().remove(myCollab);
        }

        projectRepository.save(project);
    }


}
