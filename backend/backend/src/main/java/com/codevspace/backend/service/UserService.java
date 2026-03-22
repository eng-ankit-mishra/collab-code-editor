package com.codevspace.backend.service;

import com.codevspace.backend.dto.UserDetailResponse;
import com.codevspace.backend.model.User;
import com.codevspace.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserDetailResponse getUserDetail(User currentUser) {

        User user = userRepository.findById(currentUser.getId()).orElseThrow(()->new IllegalArgumentException("User Not Found"));

        return UserDetailResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatarURL(user.getAvatarUrl())
                .build();

    }
}
