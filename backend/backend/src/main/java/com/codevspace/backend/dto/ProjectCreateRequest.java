package com.codevspace.backend.dto;

import lombok.Data;

@Data
public class ProjectCreateRequest {
    private String name;
    private String description;
    private String language;
    private String codeContent;
}

