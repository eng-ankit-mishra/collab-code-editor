package com.codevspace.backend.service;


import com.codevspace.backend.dto.*;
import com.codevspace.backend.model.User;
import com.codevspace.backend.model.enums.AuthProvider;
import com.codevspace.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${app.frontend.oauth2.redirect-uri}")
    private String frontendUrl;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        var user=User.builder()
                .email(registerRequest.getEmail())
                .name(registerRequest.getName())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .authProvider(AuthProvider.LOCAL)
                .roles(Set.of("ROLE_USER"))
                .isEmailVerified(false)
                .build();

        userRepository.save(user);
        var jwtToken=jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();


    }
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword())
        );

        var user=userRepository.findByEmail(authenticationRequest.getEmail()).orElseThrow();

        var jwtToken=jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

    }

    public void processForgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        User user=userRepository.findByEmail(forgotPasswordRequest.getEmail()).orElseThrow(
                ()->new IllegalArgumentException("User with this email not found")
        );

        if(user.getAuthProvider()!=AuthProvider.LOCAL){
            throw new IllegalArgumentException("This account uses "+ user.getAuthProvider() + " login. Please reset your password with provider.");
        }

        String token= UUID.randomUUID().toString();

        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(Instant.now().plus(15, ChronoUnit.MINUTES));
        userRepository.save(user);

        String resetBaseUrl=frontendUrl.replace("/oauth2/redirect","");
        String resetLink=resetBaseUrl+"/reset-password?token="+token;

        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

    }

    public void processResetPassword(ResetPasswordRequest resetPasswordRequest) {
        User user=userRepository.findByResetPasswordToken(resetPasswordRequest.getToken()).orElseThrow(
                ()->new IllegalArgumentException("Invalid token or expired token")
        );
        if(user.getResetPasswordTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Reset token has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));

        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userRepository.save(user);
    }

}
