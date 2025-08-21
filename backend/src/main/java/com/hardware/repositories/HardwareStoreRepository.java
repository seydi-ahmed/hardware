package com.hardware.repositories;

import com.hardware.entities.HardwareStore;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HardwareStoreRepository extends JpaRepository<HardwareStore, Long> {
    List<HardwareStore> findByOwnerId(Long ownerId);
}
