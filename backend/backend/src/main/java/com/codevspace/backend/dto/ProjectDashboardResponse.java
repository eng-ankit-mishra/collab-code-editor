package com.codevspace.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ProjectDashboardResponse {
    private String Id;
    private String name;
    private String language;

    private String permission;
    private String ownershipStatus;

    private Instant updatedAt;
}
