package com.codevspace.backend.service;

import com.codevspace.backend.dto.CodeExecutionRequest;
import com.codevspace.backend.dto.CodeExecutionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.Map;

@Service
public class CodeExecutionService {

    @Value("${app.judge0.url}")
    private String judge0Url;

    public CodeExecutionResponse executeCode(CodeExecutionRequest request) {
        RestClient restClient = RestClient.create();

        System.out.println("SOURCE CODE: " + request.getSourceCode());
        System.out.println("LANGUAGE ID: " + request.getLanguageId());

        Map<String, Object> payload = new HashMap<>();
        payload.put("source_code", request.getSourceCode());
        payload.put("language_id", request.getLanguageId());

        if (request.getStdin() != null && !request.getStdin().trim().isEmpty()) {
            payload.put("stdin", request.getStdin());
        }

        String submissionUrl = judge0Url + "/submissions?base64_encoded=false&wait=true";

        try {
            tools.jackson.databind.ObjectMapper mapper = new tools.jackson.databind.ObjectMapper();
            String jsonPayload = mapper.writeValueAsString(payload);

            JsonNode responseNode = restClient.post()
                    .uri(submissionUrl)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(jsonPayload)
                    .retrieve()
                    .body(JsonNode.class);

            if (responseNode == null) {
                throw new RuntimeException("Received empty response from Judge0");
            }

            String statusDesc = "Unknown";
            if (responseNode.hasNonNull("status") && responseNode.get("status").hasNonNull("description")) {
                statusDesc = responseNode.get("status").get("description").asText();
            }

            return CodeExecutionResponse.builder()
                    .stdout(responseNode.hasNonNull("stdout") ? responseNode.get("stdout").asText() : null)
                    .stderr(responseNode.hasNonNull("stderr") ? responseNode.get("stderr").asText() : null)
                    .compileOutput(responseNode.hasNonNull("compile_output") ? responseNode.get("compile_output").asText() : null)
                    .statusDescription(statusDesc)
                    .time(responseNode.hasNonNull("time") ? responseNode.get("time").asText() : null)
                    .memory(responseNode.hasNonNull("memory") ? responseNode.get("memory").asText() : null)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to reach execution engine: " + e.getMessage());
        }
    }
}
