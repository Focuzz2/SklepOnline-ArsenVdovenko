package com.example.shop.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order; 

    private Long productId; 
    private String productName;
    private int quantity;
    private double priceAtOrder;

    public OrderItem() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPriceAtOrder() { return priceAtOrder; }
    public void setPriceAtOrder(double priceAtOrder) { this.priceAtOrder = priceAtOrder; }
}