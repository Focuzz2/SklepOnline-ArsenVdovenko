package com.example.shop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nazwa produktu nie może być pusta")
    @Size(min = 2, max = 50, message = "Nazwa musi mieć od 2 do 50 znaków")
    private String name;

    @NotBlank(message = "Opis nie może być pusty")
    @Size(min = 5, max = 500, message = "Opis musi mieć od 5 do 500 znaków")
    private String description;

    @Positive(message = "Cena musi być dodatnia")
    private double price;

    @Min(value = 0, message = "Ilość nie może być ujemna")
    private int quantity;

    @NotBlank(message = "Adres zdjęcia nie może być pusty")
    @Column(name = "image_url")
    private String imageUrl;

    public Product() {
    }

    public Product(String name, String description, double price, int quantity, String imageUrl) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
