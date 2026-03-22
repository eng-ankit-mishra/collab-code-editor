package com.codevspace.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDetailResponse {
    private String id;
    private String name;
    private String email;
    private String avatarURL;
}
