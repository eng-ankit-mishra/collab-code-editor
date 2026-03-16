package com.codevspace.backend.model;

import com.codevspace.backend.model.enums.CollaboratorStatus;
import com.codevspace.backend.model.enums.ProjectRole;
import lombok.*;

import java.time.Instant;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Collaborator {
    private String userId;
    private ProjectRole role;

    @Builder.Default
    private CollaboratorStatus status = CollaboratorStatus.ACCEPTED;
    private String invitedByName;

    @Builder.Default
    private Instant joinedAt= Instant.now();
}
