package com.codevspace.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CodeExecutionResponse {
    private String stdout;
    private String stderr;
    private String compileOutput;
    private String statusDescription;
    private String time;
    private String memory;
}
