package com.example.shop.service;

import com.example.shop.dto.OrderDTO;
import com.example.shop.model.Order;
import com.example.shop.model.OrderItem;
import com.example.shop.model.Product;
import com.example.shop.model.OrderStatus;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // Конструктор
    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        
        // Mapowanie danych klienta
        order.setCustomerName(orderDTO.getCustomer().getName());
        order.setCustomerEmail(orderDTO.getCustomer().getEmail());
        order.setCustomerAddress(orderDTO.getCustomer().getAddress());
        order.setCustomerPhone(orderDTO.getCustomer().getPhone());
        
        order.setTotalAmount(orderDTO.getTotal());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);

        // Mapowanie OrderItemDTO na OrderItem
        List<OrderItem> items = orderDTO.getItems().stream()
            .map(itemDto -> {
                OrderItem item = new OrderItem();
                item.setOrder(order); 
                item.setProductId(itemDto.getProductId());
                item.setQuantity(itemDto.getQuantity());
                item.setPriceAtOrder(itemDto.getPrice());
                
                // Pobieranie nazwy produktu
                Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono produktu o ID: " + itemDto.getProductId()));
                    
                item.setProductName(product.getName());
                
                return item;
            }).collect(Collectors.toList());

        order.setItems(items);
        
        return orderRepository.save(order);
    }
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Zamówienie nie zostało znalezione"));
                
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
    // Pobieranie wszystkich zamówień (Najnowsze na górze)
    public List<Order> getAllOrders() {
        // Używamy Sort.Direction.DESC z poprawnym importem
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate"));
    }
}