package com.codevspace.backend.dto;

import com.codevspace.backend.model.Language;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvitationResponse {
    private String projectId;
    private String projectName;
    private Language language;
    private String permission;
    private String invitedBy;
}
