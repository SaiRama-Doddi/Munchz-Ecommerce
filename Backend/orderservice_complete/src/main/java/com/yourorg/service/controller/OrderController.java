package com.yourorg.service.controller;

import com.yourorg.service.dto.*;
import com.yourorg.service.entity.OrderEntity;
import com.yourorg.service.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")

public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    /* ===========================
       CREATE ORDER
    =========================== */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(
            @Valid @RequestBody OrderRequest request
    ) throws Exception {

        UUID orderId = service.createOrder(request);

        return ResponseEntity.status(201).body(
                Map.of(
                        "orderId", orderId,
                        "status", "CREATED"
                )
        );
    }


    /* ===========================
       GET ORDER BY ID
    =========================== */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID id) {
        return service.getOrder(id)
                .map(order -> ResponseEntity.ok(toResponse(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    /* ===========================
       LIST ORDERS
    =========================== */
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> listOrders(Pageable pageable) {
        return ResponseEntity.ok(
                service.listUserOrders(pageable)
                        .map(this::toResponse)
        );
    }


    /* ===========================
       UPDATE ORDER
    =========================== */
    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable UUID id,
            @Valid @RequestBody OrderRequest request
    ) throws Exception {

        return service.updateOrder(id, request)
                .map(order -> ResponseEntity.ok(toResponse(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    /* ===========================
       DELETE ORDER
    =========================== */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
        service.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    /* ===========================
       ENTITY → RESPONSE
    =========================== */
    private OrderResponse toResponse(OrderEntity order) {

        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setUserId(order.getUserId());
        response.setOrderStatus(order.getOrderStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setCurrency(order.getCurrency());
        response.setPlacedAt(order.getPlacedAt());

        response.setShippingAddress(order.getShippingAddress());
        response.setBillingAddress(order.getBillingAddress());

        response.setItems(
                order.getItems().stream()
                        .map(item -> {
                            OrderItemResponse ir = new OrderItemResponse();
                            ir.setProductId(item.getProductId());
                            ir.setSkuId(item.getSkuId());
                            ir.setProductName(item.getProductName());
                            ir.setUnitPrice(item.getUnitPrice());
                            ir.setQuantity(item.getQuantity());
                            ir.setLineTotal(item.getLineTotal());

                            // ✅ IMAGE FROM PRODUCT SERVICE (NOT STORED)
                            ir.setImageUrl(
                                    service.resolveProductImage(item.getProductId())
                            );
                            return ir;
                        })
                        .collect(Collectors.toList())
        );

        return response;
    }



    /* ===========================
   PAYMENT SUCCESS (FROM PAYMENT SERVICE)
=========================== */
    @PutMapping("/{orderId}/payment-success")
    public ResponseEntity<Void> markPaymentSuccess(
            @PathVariable UUID orderId,
            @RequestParam(required = false) UUID paymentId
    ) {
        service.markPaymentSuccess(orderId, paymentId);
        return ResponseEntity.ok().build();
    }





}
