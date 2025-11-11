package com.example.shop;

import com.example.shop.model.Product;
import com.example.shop.repository.ProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@DataJpaTest
public class ProductRepositoryTest {

    @Autowired
    private ProductRepository repository;
    @BeforeEach
    void clearDatabase() {
        repository.deleteAll();
    }
    @Test
    void testSaveAndFind() {
        Product product = new Product("Test", "Opis testowy", 10.0, 5, "https://freshmart.com.ua/storage/web/cache/product/119/yabluko-dzhonagold.jpeg?w=912&h=690&fit=resize&q=80&fm=pjpg&t=1571622127&s=8e5f9c635489fd405c1e71f15249c265");
        repository.save(product);

        List<Product> products = repository.findAll();
        assertThat(products).isNotEmpty();
        assertThat(products.get(0).getName()).isEqualTo("Test");
    }
}
