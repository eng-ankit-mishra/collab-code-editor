package com.codevspace.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvitationResponse {
    private String projectId;
    private String projectName;
    private String language;
    private String permission;
    private String invitedBy;
}
