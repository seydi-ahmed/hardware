package com.hardware.dto;

import lombok.Data;

@Data
public class PublicStoreDto {
    private Long id;
    private String name;
    private String address;
    private String ownerUsername;
}