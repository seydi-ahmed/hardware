package com.hardware.controllers;

import com.hardware.dto.HardwareStoreDto;
import com.hardware.entities.HardwareStore;
import com.hardware.service.HardwareStoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stores")
public class HardwareStoreController {

    private final HardwareStoreService hardwareStoreService;

    public HardwareStoreController(HardwareStoreService hardwareStoreService) {
        this.hardwareStoreService = hardwareStoreService;
    }

    // Déjà implémenté
    @PostMapping
    public ResponseEntity<HardwareStore> createStore(@RequestBody HardwareStoreDto storeDto) {
        HardwareStore store = hardwareStoreService.createStore(storeDto);
        return ResponseEntity.ok(store);
    }

    // À ajouter - Récupérer toutes les quincailleries de l'utilisateur
    @GetMapping
    public ResponseEntity<List<HardwareStore>> getUserStores() {
        List<HardwareStore> stores = hardwareStoreService.getUserStores();
        return ResponseEntity.ok(stores);
    }

    // À ajouter - Récupérer une quincaillerie spécifique
    @GetMapping("/{id}")
    public ResponseEntity<HardwareStore> getStore(@PathVariable Long id) {
        Optional<HardwareStore> store = hardwareStoreService.getStoreById(id);
        return store.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // À ajouter - Mettre à jour une quincaillerie
    @PutMapping("/{id}")
    public ResponseEntity<HardwareStore> updateStore(@PathVariable Long id, @RequestBody HardwareStoreDto storeDto) {
        Optional<HardwareStore> store = hardwareStoreService.updateStore(id, storeDto);
        return store.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // À ajouter - Supprimer une quincaillerie
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStore(@PathVariable Long id) {
        boolean deleted = hardwareStoreService.deleteStore(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}