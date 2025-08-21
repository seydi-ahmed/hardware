package com.hardware.controllers;

import com.hardware.entities.HardwareStore;
import com.hardware.entities.Product;
import com.hardware.repositories.HardwareStoreRepository;
import com.hardware.repositories.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final HardwareStoreRepository hardwareStoreRepository;
    private final ProductRepository productRepository;

    public PublicController(HardwareStoreRepository hardwareStoreRepository, ProductRepository productRepository) {
        this.hardwareStoreRepository = hardwareStoreRepository;
        this.productRepository = productRepository;
    }

    // Récupérer toutes les quincailleries
    @GetMapping("/stores")
    public List<HardwareStore> getAllStores() {
        return hardwareStoreRepository.findAll();
    }

    // Récupérer tous les produits
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Récupérer les produits d'une quincaillerie spécifique
    @GetMapping("/stores/{storeId}/products")
    public List<Product> getProductsByStore(@PathVariable Long storeId) {
        return productRepository.findByStoreId(storeId);
    }
}