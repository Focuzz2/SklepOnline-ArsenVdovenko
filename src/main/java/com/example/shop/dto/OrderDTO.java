package com.example.shop.dto;

import java.util.List;

public class OrderDTO {
    
    private CustomerDTO customer;
    private List<OrderItemDTO> items;
    private double total;

    // Konstruktor, Gettery i Settery

    public OrderDTO() {}

    public CustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTO customer) {
        this.customer = customer;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}