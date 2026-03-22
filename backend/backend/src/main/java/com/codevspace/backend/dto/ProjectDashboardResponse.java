package com.codevspace.backend.dto;

import com.codevspace.backend.model.Language;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ProjectDashboardResponse {
    private String id;
    private String name;
    private Language language;

    private String permission;
    private String ownerName;
    private String ownershipStatus;

    private Instant updatedAt;
}
