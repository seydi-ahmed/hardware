package com.hardware.dto;

import com.hardware.enums.*;

import lombok.Data;

@Data

public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role = Role.OWNER;
    private Long storeId;
}