package com.codevspace.backend.controller;

import com.codevspace.backend.dto.*;
import com.codevspace.backend.model.Project;
import com.codevspace.backend.model.User;
import com.codevspace.backend.repository.ProjectRepository;
import com.codevspace.backend.service.CodeExecutionService;
import com.codevspace.backend.service.ProjectService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/projects")
@RestController
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final CodeExecutionService codeExecutionService;

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectCreateRequest request, @AuthenticationPrincipal User currentUser) {
        Project project= projectService.createProject(request,currentUser);
        return ResponseEntity.ok().body(project);
    }

//    @GetMapping
//    public ResponseEntity<List<Project>> getMyProjects(@AuthenticationPrincipal User currentUser) {
//        List<Project> list= projectService.getProjects(currentUser.getId());
//        return ResponseEntity.ok().body(list);
//    }

//    @PostMapping("/{projectId}/collaborators")
//    public ResponseEntity<Project> addCollaborator(@PathVariable String projectId, @RequestBody InviteCollaboratorRequest request, @AuthenticationPrincipal User currentUser ) {
//        Project project=projectService.addCollaborator(projectId,request,currentUser);
//        return ResponseEntity.ok().body(project);
//    }


    @GetMapping
    public ResponseEntity<List<ProjectDashboardResponse>> getAllProjects(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok().body(projectService.getDashboardProjects(currentUser.getId()));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable String projectId) {
        return ResponseEntity.ok().body(projectService.getProjectById(projectId));
    }


    @PatchMapping("/{projectId}/code")
    public ResponseEntity<Void> saveCode(@PathVariable String projectId, @RequestBody CodeSaveRequest request, @AuthenticationPrincipal User currentUser) {
        projectService.saveCode(projectId,request.getCodeContent(),currentUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{projectId}/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(@PathVariable String projectId,@RequestBody CodeExecutionRequest request,@AuthenticationPrincipal User currentUser){


        CodeExecutionResponse response=codeExecutionService.executeCode(request);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/{projectId}/invite")
    public ResponseEntity<String> inviteUser(
            @PathVariable String projectId,
            @RequestBody InviteCollaboratorRequest request,
            @AuthenticationPrincipal User currentUser
    ){
        projectService.inviteCollaborator(projectId,request,currentUser);
        return ResponseEntity.ok("Invitation Send Successfully");
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<InvitationResponse>> getAllInvitations(@AuthenticationPrincipal User currentUser){
        List<InvitationResponse> invitations=projectService.getMyInvitation(currentUser.getId());
        return ResponseEntity.ok().body(invitations);
    }

    @PostMapping("{projectId}/invitations/respond")
    public ResponseEntity<String> respondToInvitation(@PathVariable String projectId,@AuthenticationPrincipal User currentUser,@RequestBody RespondInvitationRequest request){
    projectService.respondToInvitation(projectId, currentUser.getId(), request.isAccept());
        String message = request.isAccept() ? "Invitation accepted!" : "Invitation rejected.";
        return ResponseEntity.ok(message);
    }


}
