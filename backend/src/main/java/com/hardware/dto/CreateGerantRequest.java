package com.hardware.dto;

import lombok.Data;

@Data
public class CreateGerantRequest {
    private String username;
    private String email;
    private String password;
    private Long storeId;
}
