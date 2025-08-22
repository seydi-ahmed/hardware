package com.hardware.controllers;

import com.hardware.dto.PublicProductDto;
import com.hardware.dto.PublicStoreDto;
import com.hardware.entities.HardwareStore;
import com.hardware.entities.Product;
import com.hardware.repositories.HardwareStoreRepository;
import com.hardware.repositories.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final HardwareStoreRepository hardwareStoreRepository;
    private final ProductRepository productRepository;

    public PublicController(HardwareStoreRepository hardwareStoreRepository, ProductRepository productRepository) {
        this.hardwareStoreRepository = hardwareStoreRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/stores")
    public List<PublicStoreDto> getAllStores() {
        return hardwareStoreRepository.findAll().stream()
                .map(this::convertToStoreDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/products")
    public List<PublicProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToProductDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/stores/{storeId}/products")
    public List<PublicProductDto> getStoreProducts(@PathVariable Long storeId) {
        return productRepository.findByStoreId(storeId).stream()
                .map(this::convertToProductDto)
                .collect(Collectors.toList());
    }

    private PublicStoreDto convertToStoreDto(HardwareStore store) {
        PublicStoreDto dto = new PublicStoreDto();
        dto.setId(store.getId());
        dto.setName(store.getName());
        dto.setAddress(store.getAddress());
        dto.setOwnerUsername(store.getOwner().getUsername());
        return dto;
    }

    // PublicController.java
    @GetMapping("/stores/{id}")
    public PublicStoreDto getStoreById(@PathVariable Long id) {
        HardwareStore store = hardwareStoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        return convertToStoreDto(store);
    }

    @GetMapping("/products/{id}")
    public PublicProductDto getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToProductDto(product);
    }

    private PublicProductDto convertToProductDto(Product product) {
        PublicProductDto dto = new PublicProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setStoreName(product.getStore().getName());
        return dto;
    }

}