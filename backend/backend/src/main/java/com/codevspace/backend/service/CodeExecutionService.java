package com.codevspace.backend.service;

import com.codevspace.backend.dto.CodeExecutionRequest;
import com.codevspace.backend.dto.CodeExecutionResponse;
import com.codevspace.backend.dto.LanguageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    @Value("${app.judge0.url}")
    private String judge0Url;

    private final RestTemplate restTemplate;

    public List<LanguageDTO> getLanguages(){
        String endpoint = judge0Url + "/languages";

        try {
            // 2. Make the HTTP GET request. We tell Spring to expect an Array of LanguageDTOs.
            ResponseEntity<LanguageDTO[]> response = restTemplate.getForEntity(endpoint, LanguageDTO[].class);

            // 3. Check if successful and map it to your response object
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<LanguageDTO> languageList = Arrays.asList(response.getBody());
                return  languageList;
            } else {
                throw new RuntimeException("Failed to fetch languages from Judge0. Status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            // If the Judge0 server is down or the URL is wrong, it will land here
            throw new RuntimeException("Error communicating with Judge0: " + e.getMessage());
        }
    }

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
