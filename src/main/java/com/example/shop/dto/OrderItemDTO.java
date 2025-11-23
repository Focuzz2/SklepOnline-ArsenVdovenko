package com.example.shop.dto;

public class OrderItemDTO {
    
    private Long productId; // Musi być Long, aby pasować do ID produktu
    private int quantity;
    private double price; // Cena jednostkowa

    // Konstruktor, Gettery i Settery

    public OrderItemDTO() {}

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}