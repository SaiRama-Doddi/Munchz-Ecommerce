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
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
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
        OrderResponse r = new OrderResponse();

        r.setOrderId(order.getId());
        r.setUserId(order.getUserId());
        r.setUserName(order.getUserName());
        r.setUserEmail(order.getUserEmail());
        r.setOrderStatus(order.getOrderStatus());

        r.setTotalAmount(order.getTotalAmount());
        r.setTotalTax(order.getTotalTax());
        r.setTotalDiscount(order.getTotalDiscount());

        r.setPaymentId(order.getPaymentId());
        r.setCouponCode(order.getCouponCode());
        r.setCouponId(order.getCouponId());

        r.setCurrency(order.getCurrency());
        r.setShippingAddress(order.getShippingAddress());
        r.setBillingAddress(order.getBillingAddress());
        Instant placed = order.getPlacedAt();
        Instant updated = order.getUpdatedAt();

        DateTimeFormatter fmt =
                DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");



        r.setPlacedAt(
                placed == null ? null :
                        LocalDateTime.ofInstant(placed, ZoneId.systemDefault()).format(fmt)
        );

        r.setUpdatedAt(
                updated == null ? null :
                        LocalDateTime.ofInstant(updated, ZoneId.systemDefault()).format(fmt)
        );




        r.setItems(
                order.getItems().stream().map(i -> {
                    OrderItemResponse ir = new OrderItemResponse();
                    ir.setProductId(i.getProductId());
                    ir.setSkuId(i.getSkuId());
                    ir.setProductName(i.getProductName());
                    ir.setUnitPrice(i.getUnitPrice());
                    ir.setQuantity(i.getQuantity());
                    ir.setLineTotal(i.getLineTotal());
                    ir.setTaxAmount(i.getTaxAmount());
                    ir.setDiscountAmount(i.getDiscountAmount());
                    ir.setVariantLabel(i.getVariantLabel());
                    ir.setImageUrl(service.resolveProductImage(i.getProductId()));
                    return ir;
                }).toList()
        );

        return r;
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


    /* ===========================
       ADMIN — LIST ALL ORDERS
    =========================== */
    @GetMapping("/adminallorders")
    public ResponseEntity<Page<OrderResponse>> listAllOrdersForAdmin(Pageable pageable) {
        return ResponseEntity.ok(
                service.listAllOrders(pageable)
                        .map(this::toResponse)
        );
    }



}