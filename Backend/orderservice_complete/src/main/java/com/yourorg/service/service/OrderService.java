package com.yourorg.service.service;

import com.yourorg.service.client.ProductClient;
import com.yourorg.service.client.UserProfileClient;
import com.yourorg.service.dto.*;
import com.yourorg.service.entity.*;
import com.yourorg.service.repository.*;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final UserProfileClient userProfileClient;
    private final OrderRepository orderRepository;
    private final OrderEventRepository orderEventRepository;
    private final ProductClient productClient;

    public OrderService(
            UserProfileClient userProfileClient,
            OrderRepository orderRepository,
            OrderEventRepository orderEventRepository,
            ProductClient productClient
    ) {
        this.userProfileClient = userProfileClient;
        this.orderRepository = orderRepository;
        this.orderEventRepository = orderEventRepository;
        this.productClient = productClient;
    }

    /* ===========================
       CREATE ORDER
    =========================== */
    @Transactional
    public UUID createOrder(OrderRequest req) {

        System.out.println("========== CREATE ORDER START ==========");

        var auth = SecurityContextHolder.getContext().getAuthentication();

        UUID userId = (UUID) auth.getPrincipal();
        String email = (String) auth.getDetails();

        ProfileResponse profile = userProfileClient.getProfile();

        OrderEntity order = new OrderEntity();
        order.setUserId(userId);
        order.setUserEmail(email);
        order.setUserName(profile.getFirstName() + " " + profile.getLastName());
        order.setOrderStatus("CREATED");
        order.setCurrency("INR");

        /* ✅ STORE JSON AS STRING (NO PARSING) */
        order.setShippingAddress(req.getShippingAddress());
        order.setBillingAddress(req.getBillingAddress());

        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new RuntimeException("Order items are empty");
        }

        List<OrderItemEntity> items =
                req.getItems().stream()
                        .map(i -> toOrderItem(i, order))
                        .collect(Collectors.toList());

        order.setItems(items);

        BigDecimal total =
                items.stream()
                        .map(OrderItemEntity::getLineTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);

        /* ✅ SAVE + FLUSH */
        OrderEntity saved = orderRepository.saveAndFlush(order);

        /* ✅ SAVE EVENT AFTER ORDER EXISTS */
        OrderEventEntity event = new OrderEventEntity();
        event.setOrder(saved);
        event.setEventType("ORDER_CREATED");
        event.setPayload("{\"status\":\"CREATED\"}");

        orderEventRepository.save(event);

        System.out.println("========== CREATE ORDER END ==========");
        return saved.getId();
    }

    /* ===========================
       READ
    =========================== */
    @Transactional(readOnly = true)
    public Optional<OrderEntity> getOrder(UUID id) {
        return orderRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Page<OrderEntity> listOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    /* ===========================
       UPDATE
    =========================== */
    @Transactional
    public Optional<OrderEntity> updateOrder(UUID id, OrderRequest req) {
        return orderRepository.findById(id).map(existing -> {

            /* ✅ STORE JSON STRING DIRECTLY */
            existing.setShippingAddress(req.getShippingAddress());
            existing.setBillingAddress(req.getBillingAddress());

            existing.getItems().clear();

            List<OrderItemEntity> items =
                    req.getItems().stream()
                            .map(i -> toOrderItem(i, existing))
                            .collect(Collectors.toList());

            existing.setItems(items);

            BigDecimal total =
                    items.stream()
                            .map(OrderItemEntity::getLineTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

            existing.setTotalAmount(total);

            return orderRepository.save(existing);
        });
    }

    /* ===========================
       DELETE
    =========================== */
    @Transactional
    public void deleteOrder(UUID id) {
        orderRepository.deleteById(id);
    }

    /* ===========================
       INTERNAL MAPPER
    =========================== */
    private OrderItemEntity toOrderItem(OrderItemRequest req, OrderEntity order) {

        ProductResponse product;
        try {
            product = productClient.getProductById(req.getProductId());
        } catch (FeignException.Forbidden ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Product service rejected request");
        } catch (FeignException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }

        var variant = product.getVariants().stream()
                .filter(v -> Objects.equals(v.getId(), req.getVariantId()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid variantId " + req.getVariantId())
                );

        /* ✅ SAFE BigDecimal conversion */
        BigDecimal qty = new BigDecimal(req.getQuantity().toString());
        BigDecimal price = variant.getOfferPrice();

        return OrderItemEntity.builder()
                .order(order)
                .productId(product.getId())
                .skuId(variant.getSkuId())
                .productName(product.getName())
                .unitPrice(price)
                .quantity(qty)
                .lineTotal(price.multiply(qty))
                .build();
    }
}
