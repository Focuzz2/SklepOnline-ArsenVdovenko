package com.example.shop.controller;

import com.example.shop.dto.OrderDTO;
import com.example.shop.model.Order;
import com.example.shop.model.OrderStatus;
import com.example.shop.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. Ендпоінт для створення замовлення (доступний для всіх)
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody OrderDTO orderDTO) {
        Order newOrder = orderService.createOrder(orderDTO);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    // 2. Ендпоінт для отримання всіх замовлень (Тільки ADMIN)
    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // 3. Ендпоінт для зміни статусу замовлення (Тільки ADMIN)
@PutMapping("/admin/orders/{id}/status")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody String newStatusString) {
    
    // ------------------------------------------------------------------
    // ВИПРАВЛЕННЯ: Спрощене очищення
    // ------------------------------------------------------------------
    String cleanStatus = newStatusString.trim().toUpperCase(); 
    
    try {
        System.out.println("Otrzymany status JEDNAK: [" + cleanStatus + "]"); 
        
        // Тут cleanStatus має бути чистим "ACCEPT", "DONE" тощо.
        OrderStatus newStatus = OrderStatus.valueOf(cleanStatus);
        
        Order updatedOrder = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(updatedOrder);
        
    } catch (IllegalArgumentException e) {
        System.err.println("BŁĄD KONWERSJI ENUM. Oczekiwana nazwa: " + cleanStatus);
        return ResponseEntity.badRequest().build(); 
        
    } catch (RuntimeException e) {
        // Якщо замовлення не знайдено
        return ResponseEntity.notFound().build(); 
    }
}
}