package com.hardware.service;

import com.hardware.dto.ProductDto;
import com.hardware.entities.HardwareStore;
import com.hardware.entities.Product;
import com.hardware.entities.User;
import com.hardware.repositories.HardwareStoreRepository;
import com.hardware.repositories.ProductRepository;
import com.hardware.repositories.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final HardwareStoreRepository hardwareStoreRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, HardwareStoreRepository hardwareStoreRepository,
            UserRepository userRepository) {
        this.productRepository = productRepository;
        this.hardwareStoreRepository = hardwareStoreRepository;
        this.userRepository = userRepository;
    }

    // Récupérer l'utilisateur connecté
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + username));
    }

    // Créer un produit dans une quincaillerie (vérification que l'utilisateur est
    // le propriétaire de la quincaillerie)
    public Product createProduct(Long storeId, ProductDto productDto) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> storeOptional = hardwareStoreRepository.findById(storeId);
        if (storeOptional.isEmpty()) {
            throw new RuntimeException("Quincaillerie non trouvée");
        }
        HardwareStore store = storeOptional.get();
        if (!store.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas le propriétaire de cette quincaillerie");
        }
        Product product = Product.builder()
                .name(productDto.getName())
                .price(productDto.getPrice())
                .stock(productDto.getStock())
                .store(store)
                .build();
        return productRepository.save(product);
    }

    // Récupérer tous les produits d'une quincaillerie (vérification ownership)
    public List<Product> getProductsByStore(Long storeId) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> storeOptional = hardwareStoreRepository.findById(storeId);
        if (storeOptional.isEmpty()) {
            throw new RuntimeException("Quincaillerie non trouvée");
        }
        HardwareStore store = storeOptional.get();
        if (!store.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas le propriétaire de cette quincaillerie");
        }
        return productRepository.findByStoreId(storeId);
    }

    // Récupérer un produit spécifique (vérification ownership)
    public Optional<Product> getProductById(Long storeId, Long productId) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> storeOptional = hardwareStoreRepository.findById(storeId);
        if (storeOptional.isEmpty()) {
            throw new RuntimeException("Quincaillerie non trouvée");
        }
        HardwareStore store = storeOptional.get();
        if (!store.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas le propriétaire de cette quincaillerie");
        }
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isEmpty() || !productOptional.get().getStore().getId().equals(storeId)) {
            return Optional.empty();
        }
        return productOptional;
    }

    // Mettre à jour un produit (vérification ownership)
    public Optional<Product> updateProduct(Long storeId, Long productId, ProductDto productDto) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> storeOptional = hardwareStoreRepository.findById(storeId);
        if (storeOptional.isEmpty()) {
            throw new RuntimeException("Quincaillerie non trouvée");
        }
        HardwareStore store = storeOptional.get();
        if (!store.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas le propriétaire de cette quincaillerie");
        }
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isEmpty() || !productOptional.get().getStore().getId().equals(storeId)) {
            return Optional.empty();
        }
        Product product = productOptional.get();
        product.setName(productDto.getName());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        return Optional.of(productRepository.save(product));
    }

    // Supprimer un produit (vérification ownership)
    public boolean deleteProduct(Long storeId, Long productId) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> storeOptional = hardwareStoreRepository.findById(storeId);
        if (storeOptional.isEmpty()) {
            throw new RuntimeException("Quincaillerie non trouvée");
        }
        HardwareStore store = storeOptional.get();
        if (!store.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Vous n'êtes pas le propriétaire de cette quincaillerie");
        }
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isEmpty() || !productOptional.get().getStore().getId().equals(storeId)) {
            return false;
        }
        productRepository.deleteById(productId);
        return true;
    }
}