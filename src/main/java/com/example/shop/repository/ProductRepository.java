package com.example.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shop.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}