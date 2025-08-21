package com.hardware.repositories;

import com.hardware.entities.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStoreId(Long storeId);

}
