package com.codevspace.backend.dto;

import lombok.Data;

@Data
public class CodeExecutionRequest {
    private Integer languageId;
    private String sourceCode;
    private String stdin;

}
