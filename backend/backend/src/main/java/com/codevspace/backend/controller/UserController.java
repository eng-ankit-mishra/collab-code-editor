package com.codevspace.backend.controller;

import com.codevspace.backend.dto.UserDetailResponse;
import com.codevspace.backend.model.User;
import com.codevspace.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDetailResponse> getUserDetail(@AuthenticationPrincipal User currentUser){
        return ResponseEntity.ok().body(userService.getUserDetail(currentUser));
    }

}
