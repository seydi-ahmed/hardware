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

    public ProductService(ProductRepository productRepository,
                          HardwareStoreRepository hardwareStoreRepository,
                          UserRepository userRepository) {
        this.productRepository = productRepository;
        this.hardwareStoreRepository = hardwareStoreRepository;
        this.userRepository = userRepository;
    }

    // 🔹 Récupérer l'utilisateur connecté
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + username));
    }

    // 🔹 Vérification: est-ce que l'utilisateur est owner OU gérant du store ?
    private void checkAccess(HardwareStore store, User currentUser) {
        boolean isOwner = store.getOwner().getId().equals(currentUser.getId());
        boolean isGerant = store.getGerant() != null && store.getGerant().getId().equals(currentUser.getId());

        if (!isOwner && !isGerant) {
            throw new RuntimeException("Accès refusé : vous n'êtes ni le propriétaire ni le gérant de cette quincaillerie");
        }
    }

    // 🔹 Créer un produit
    public Product createProduct(Long storeId, ProductDto productDto) {
        User currentUser = getCurrentUser();
        HardwareStore store = hardwareStoreRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Quincaillerie non trouvée"));

        checkAccess(store, currentUser);

        Product product = Product.builder()
                .name(productDto.getName())
                .price(productDto.getPrice())
                .stock(productDto.getStock())
                .store(store)
                .build();
        return productRepository.save(product);
    }

    // 🔹 Récupérer tous les produits
    public List<Product> getProductsByStore(Long storeId) {
        User currentUser = getCurrentUser();
        HardwareStore store = hardwareStoreRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Quincaillerie non trouvée"));

        checkAccess(store, currentUser);

        return productRepository.findByStoreId(storeId);
    }

    // 🔹 Récupérer un produit spécifique
    public Optional<Product> getProductById(Long storeId, Long productId) {
        User currentUser = getCurrentUser();
        HardwareStore store = hardwareStoreRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Quincaillerie non trouvée"));

        checkAccess(store, currentUser);

        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isEmpty() || !productOptional.get().getStore().getId().equals(storeId)) {
            return Optional.empty();
        }
        return productOptional;
    }

    // 🔹 Mettre à jour un produit
    public Optional<Product> updateProduct(Long storeId, Long productId, ProductDto productDto) {
        User currentUser = getCurrentUser();
        HardwareStore store = hardwareStoreRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Quincaillerie non trouvée"));

        checkAccess(store, currentUser);

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

    // 🔹 Supprimer un produit
    public boolean deleteProduct(Long storeId, Long productId) {
        User currentUser = getCurrentUser();
        HardwareStore store = hardwareStoreRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Quincaillerie non trouvée"));

        checkAccess(store, currentUser);

        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isEmpty() || !productOptional.get().getStore().getId().equals(storeId)) {
            return false;
        }

        productRepository.deleteById(productId);
        return true;
    }
}
