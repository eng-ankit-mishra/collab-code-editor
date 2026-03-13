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

    @GetMapping
    public ResponseEntity<List<Project>> getMyProjects(@AuthenticationPrincipal User currentUser) {
        List<Project> list= projectService.getProject(currentUser.getId());
        return ResponseEntity.ok().body(list);
    }

    @PostMapping("{projectId}/collaborators")
    public ResponseEntity<Project> addCollaborator(@PathVariable String projectId, @RequestBody InviteCollaboratorRequest request, @AuthenticationPrincipal User currentUser ) {
        Project project=projectService.addCollaborator(projectId,request,currentUser);
        return ResponseEntity.ok().body(project);
    }

    @GetMapping
    public ResponseEntity<List<ProjectDashboardResponse>> getProjects(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok().body(projectService.getDashboardProjects(currentUser.getId()));
    }

    @PatchMapping("{projectId}/code")
    public ResponseEntity<Void> saveCode(@PathVariable String projectId, @RequestBody CodeSaveRequest request, @AuthenticationPrincipal User currentUser) {
        projectService.saveCode(projectId,request.getCodeContent(),currentUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("{projectId}/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(@PathVariable String projectId,@RequestBody CodeExecutionRequest request,@AuthenticationPrincipal User currentUser){


        CodeExecutionResponse response=codeExecutionService.executeCode(request);
        return ResponseEntity.ok().body(response);
    }


}
