package com.codevspace.backend.dto;

import com.codevspace.backend.model.Language;
import lombok.Data;

@Data
public class CodeExecutionRequest {
    private Integer languageId;
    private String sourceCode;
    private String stdin;

}
