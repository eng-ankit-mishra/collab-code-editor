package com.codevspace.backend.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
}
