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
        RestClient restClient=RestClient.create();

        Map<String,Object> payload=new HashMap<>();
        payload.put("source_code",request.getSourceCode());
        payload.put("language_id",request.getLanguage().getId());

        if(request.getStdin()!=null &&  !request.getStdin().trim().isEmpty()){
            payload.put("stdin",request.getStdin());
        }

        String submissionUrl=judge0Url + "/submissions?base64_encoded=false@wait=true";

        try{
            JsonNode responseNode=restClient.post()
                    .uri(submissionUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(JsonNode.class);




            return CodeExecutionResponse.builder()
                    .stdout(responseNode.get("stdout").asText(null))
                    .stderr(responseNode.get("stderr").asText(null))
                    .compileOutput(responseNode.get("compile_output").asText(null))
                    .statusDescription(responseNode.get("status_description").asText(null))
                    .time(responseNode.get("time").asText(null))
                    .memory(responseNode.get("memory").asText(null))
                    .build();
        }catch(Exception e){
            throw new RuntimeException("Failed to reach execution engine"+e.getMessage());
        }


    }
}
