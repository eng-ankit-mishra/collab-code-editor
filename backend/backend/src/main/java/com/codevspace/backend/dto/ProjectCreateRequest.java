package com.codevspace.backend.dto;

import com.codevspace.backend.model.Language;
import lombok.Data;

@Data
public class ProjectCreateRequest {
    private String name;
    private String description;
    private Language language;
    private String codeContent;
}

