package com.codevspace.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserStatsResponse {
    private Integer totalProjects;
    private Integer createdByUser;
    private Integer sharedWithUser;
}
