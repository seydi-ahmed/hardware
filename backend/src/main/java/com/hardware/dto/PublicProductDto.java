package com.hardware.dto;

import lombok.Data;

@Data
public class PublicProductDto {
    private Long id;
    private String name;
    private Double price;
    private Integer stock;
    private String storeName;
}