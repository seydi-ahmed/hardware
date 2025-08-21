package com.hardware.service;

import com.hardware.dto.HardwareStoreDto;
import com.hardware.entities.HardwareStore;
import com.hardware.entities.User;
import com.hardware.repositories.HardwareStoreRepository;
import com.hardware.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HardwareStoreService {

    private final HardwareStoreRepository hardwareStoreRepository;
    private final UserRepository userRepository;

    public HardwareStoreService(HardwareStoreRepository hardwareStoreRepository, UserRepository userRepository) {
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

    // Créer une nouvelle quincaillerie
    public HardwareStore createStore(HardwareStoreDto storeDto) {
        User currentUser = getCurrentUser();

        HardwareStore store = HardwareStore.builder()
                .name(storeDto.getName())
                .address(storeDto.getAddress())
                .owner(currentUser)
                .build();

        return hardwareStoreRepository.save(store);
    }

    // Récupérer toutes les quincailleries de l'utilisateur connecté
    public List<HardwareStore> getUserStores() {
        User currentUser = getCurrentUser();
        return hardwareStoreRepository.findByOwnerId(currentUser.getId());
    }

    // Récupérer une quincaillerie spécifique par ID (vérification ownership)
    public Optional<HardwareStore> getStoreById(Long id) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> store = hardwareStoreRepository.findById(id);

        if (store.isPresent() && store.get().getOwner().getId().equals(currentUser.getId())) {
            return store;
        }

        return Optional.empty();
    }

    // Mettre à jour une quincaillerie
    public Optional<HardwareStore> updateStore(Long id, HardwareStoreDto storeDto) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> existingStore = hardwareStoreRepository.findById(id);

        if (existingStore.isPresent() && existingStore.get().getOwner().getId().equals(currentUser.getId())) {
            HardwareStore store = existingStore.get();
            store.setName(storeDto.getName());
            store.setAddress(storeDto.getAddress());
            return Optional.of(hardwareStoreRepository.save(store));
        }

        return Optional.empty();
    }

    // Supprimer une quincaillerie
    public boolean deleteStore(Long id) {
        User currentUser = getCurrentUser();
        Optional<HardwareStore> store = hardwareStoreRepository.findById(id);

        if (store.isPresent() && store.get().getOwner().getId().equals(currentUser.getId())) {
            hardwareStoreRepository.deleteById(id);
            return true;
        }

        return false;
    }
}