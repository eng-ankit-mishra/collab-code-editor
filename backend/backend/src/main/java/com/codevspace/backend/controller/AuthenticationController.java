package com.codevspace.backend.controller;

import com.codevspace.backend.dto.*;
import com.codevspace.backend.service.AuthenticationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest) {
        return ResponseEntity.ok(authenticationService.authenticate(authenticationRequest));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String>  forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authenticationService.processForgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String>  resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        authenticationService.processResetPassword(resetPasswordRequest);
        return ResponseEntity.ok("Password has been successfully reset. You can now log in.");
    }
}
