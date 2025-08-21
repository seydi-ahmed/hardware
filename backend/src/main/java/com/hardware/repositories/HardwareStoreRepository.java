package com.hardware.repositories;

import com.hardware.entities.HardwareStore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HardwareStoreRepository extends JpaRepository<HardwareStore, Long> {
}
