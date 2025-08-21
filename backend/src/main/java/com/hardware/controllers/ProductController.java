package com.hardware.controllers;

import com.hardware.dto.ProductDto;
import com.hardware.entities.Product;
import com.hardware.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stores/{storeId}/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@PathVariable Long storeId, @RequestBody ProductDto productDto) {
        try {
            Product product = productService.createProduct(storeId, productDto);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProductsByStore(@PathVariable Long storeId) {
        try {
            List<Product> products = productService.getProductsByStore(storeId);
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProduct(@PathVariable Long storeId, @PathVariable Long productId) {
        try {
            Optional<Product> product = productService.getProductById(storeId, productId);
            return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long storeId, @PathVariable Long productId,
            @RequestBody ProductDto productDto) {
        try {
            Optional<Product> product = productService.updateProduct(storeId, productId, productDto);
            return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long storeId, @PathVariable Long productId) {
        try {
            boolean deleted = productService.deleteProduct(storeId, productId);
            return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}