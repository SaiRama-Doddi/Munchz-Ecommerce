package com.yourorg.service.controller;

import com.yourorg.service.dto.*;
import com.yourorg.service.entity.OrderEntity;
import com.yourorg.service.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS }
)
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest req) {
        OrderEntity saved = service.createOrder(req);
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        Optional<OrderEntity> o = service.getOrder(id);
        return o.map(order -> ResponseEntity.ok(toResponse(order)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> listOrders(Pageable pageable) {
        Page<OrderEntity> page = service.listOrders(pageable);
        Page<OrderResponse> mapped = page.map(this::toResponse);
        return ResponseEntity.ok(mapped);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderRequest req) {
        Optional<OrderEntity> updated = service.updateOrder(id, req);
        return updated.map(o -> ResponseEntity.ok(toResponse(o)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        service.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    private OrderResponse toResponse(OrderEntity saved) {
        OrderResponse resp = new OrderResponse();
        resp.setOrderId(saved.getOrderId());
        resp.setUserId(saved.getUserId());
        resp.setUserName(saved.getUserName());
        resp.setAddress(saved.getAddress());
        resp.setTotalAmount(saved.getTotalAmount());
        resp.setOrderStatus(saved.getOrderStatus());

        resp.setItems(saved.getItems().stream().map(i -> {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setProductId(i.getProductId());
            ir.setProductName(i.getProductName());
            ir.setQuantityKg(i.getQuantityKg());
            ir.setUnitPrice(i.getUnitPrice());
            ir.setLineTotal(i.getLineTotal());
            return ir;
        }).collect(Collectors.toList()));

        return resp;
    }
}
