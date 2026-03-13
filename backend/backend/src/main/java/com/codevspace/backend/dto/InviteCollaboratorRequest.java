package com.codevspace.backend.dto;

import com.codevspace.backend.model.enums.ProjectRole;
import lombok.Data;

@Data
public class InviteCollaboratorRequest {
    private String email;
    private ProjectRole role;

}
