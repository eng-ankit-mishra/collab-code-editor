package com.codevspace.backend.service;


import com.codevspace.backend.dto.AuthenticationRequest;
import com.codevspace.backend.dto.AuthenticationResponse;
import com.codevspace.backend.dto.RegisterRequest;
import com.codevspace.backend.model.User;
import com.codevspace.backend.model.enums.AuthProvider;
import com.codevspace.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

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



}
