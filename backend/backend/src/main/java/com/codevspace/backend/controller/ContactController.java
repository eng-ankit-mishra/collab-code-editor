package com.codevspace.backend.controller;

import com.codevspace.backend.dto.ContactRequest;
import com.codevspace.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contact")
public class ContactController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<String> contact(@RequestBody ContactRequest request){
        emailService.sendContactFormEmail(request);
        return ResponseEntity.ok("Message sent successfully. We will get back to you soon!");
    }

}
