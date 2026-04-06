package com.yourorg.service.service;

import com.yourorg.service.client.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final UserProfileClient userProfileClient;
    private final OrderRepository orderRepository;
    private final OrderEventRepository orderEventRepository;
    private final ProductClient productClient;
    private final CouponClient couponClient;
    private  final InventoryClient inventoryClient;
    private final ShippingClient shippingClient;
    private final ObjectMapper objectMapper = new ObjectMapper();


    /* ===========================
       CREATE ORDER
    =========================== */
    @Transactional
    public UUID createOrder(OrderRequest req) {
        log.info("--- [CREATE ORDER START] ---");
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            log.error("Order Creation Error: User not authenticated in SecurityContext!");
            throw new RuntimeException("Authentication failure: User session not found.");
        }

        UUID userId = (UUID) auth.getPrincipal();
        String email = (String) auth.getDetails();
        log.info("User: {} ({})", userId, email);

        ProfileResponse profile;
        try {
            profile = userProfileClient.getProfile();
        } catch (Exception e) {
            log.error("Order Creation Error: User Profile Service unreachable or failed: {}", e.getMessage());
            throw new RuntimeException("Profile service error. Please try again later.");
        }

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
            log.error("Order Creation Error: Empty cart items received for user {}", userId);
            throw new RuntimeException("Order cannot be empty.");
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

        /* ================= APPLY COUPON ================= */
        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            log.info("Applying Coupon: {}", req.getCouponCode());
            try {
                CouponResponse coupon = couponClient.applyCoupon(
                        new ApplyCouponRequest(req.getCouponCode(), total.doubleValue()), userId
                );
                order.setCouponId(Math.toIntExact(coupon.id()));
                order.setCouponCode(coupon.code());
                order.setTotalDiscount(BigDecimal.valueOf(coupon.appliedDiscount()));
                order.setTotalAmount(BigDecimal.valueOf(coupon.finalAmount()));
                log.info("Coupon applied successfully. Final Amount: {}", order.getTotalAmount());
            } catch (FeignException.BadRequest ex) {
                log.warn("Coupon rejected: {}", req.getCouponCode());
                throw new RuntimeException("The coupon '" + req.getCouponCode() + "' is invalid or expired.");
            } catch (Exception ex) {
                log.error("Coupon service error: {}", ex.getMessage());
                throw new RuntimeException("Could not verify coupon. Please try again.");
            }
        }

        OrderEntity saved = orderRepository.saveAndFlush(order);
        log.info("Order Saved to DB: {}", saved.getId());




        /*  SAVE EVENT AFTER ORDER EXISTS */
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
        return orderRepository.findByIdWithItems(id);
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
                .variantLabel(variant.getWeightLabel())
                .productName(product.getName())
                .unitPrice(price)
                .quantity(qty)
                .lineTotal(price.multiply(qty))
                .build();
    }

    @Transactional
    public void markPaymentSuccess(UUID orderId, UUID paymentId) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PAID".equals(order.getOrderStatus())) {
            order.setOrderStatus("PAID");
            if (paymentId != null) {
                order.setPaymentId(paymentId);
            }
                log.info("DEBUG: Payment success received for order {}. Status set to PAID.", orderId);

            // 🔽 CALL INVENTORY SERVICE
            try {
                order.getItems().forEach(item -> {
                    InventoryReduceRequest req = new InventoryReduceRequest();
                    req.setProductId(item.getProductId());
                    req.setVariant(item.getVariantLabel());
                    req.setQuantity(item.getQuantity().intValue());
                    inventoryClient.reduceStockOnOrder(req);
                });
            } catch (FeignException ex) {
                throw new RuntimeException("Inventory update failed. Payment must be reconciled.", ex);
            }
            orderRepository.save(order);
            System.out.println("DEBUG: Order " + orderId + " saved with status PAID and inventory reduced.");
        }

        // 🚛 CALL SHIPPING SERVICE (Shiprocket)
        if (order.getShiprocketOrderId() != null) {
             log.info("DEBUG: Order {} already has Shiprocket ID: {}", orderId, order.getShiprocketOrderId());
             return;
        }

        try {
            log.info("DEBUG: Starting Shiprocket sync for order {}", order.getId());
            log.info("DEBUG: Shipping Address JSON: {}", (order.getShippingAddress() != null ? order.getShippingAddress() : "NULL"));
            JsonNode addrNode = objectMapper.readTree(order.getShippingAddress());
            
            String phone = addrNode.has("phone") && !addrNode.get("phone").isNull() ? addrNode.get("phone").asText() : "";
            if (phone.isEmpty() || phone.length() < 10) phone = "9123456789"; // Plausible dummy

            String customerName = order.getUserName();
            if (customerName == null || customerName.isEmpty()) {
                customerName = "Customer";
            } else {
                customerName = customerName.trim().replaceAll("\\s+", " ");
            }

            ShipmentRequest shipReq = ShipmentRequest.builder()
                    .orderId(order.getId().toString())
                    .customerName(customerName)
                    .email(order.getUserEmail() != null ? order.getUserEmail() : "customer@munchz.com")
                    .phone(phone)
                    .address(addrNode.path("addressLine1").asText("") + " " + addrNode.path("addressLine2").asText(""))
                    .city(addrNode.path("city").asText(""))
                    .state(addrNode.path("state").asText(""))
                    .pincode(addrNode.path("pincode").asText(""))
                    .price(order.getTotalAmount().doubleValue())
                    .build();

            Map<String, Object> shipRes = shippingClient.createShipment(shipReq);
            
            if (shipRes != null) {
                if (shipRes.containsKey("order_id")) {
                    order.setShiprocketOrderId(shipRes.get("order_id").toString());
                }
                if (shipRes.containsKey("shipment_id")) {
                    order.setShiprocketShipmentId(shipRes.get("shipment_id").toString());
                }
                orderRepository.save(order);
            }

        } catch (Exception ex) {
            System.err.println("Shipping creation failed for order " + orderId + ": " + ex.getMessage());
            if (ex instanceof feign.FeignException) {
                feign.FeignException fe = (feign.FeignException) ex;
                System.err.println("Feign error: " + fe.status() + " - " + fe.contentUTF8());
            }
            ex.printStackTrace();
            // We don't throw here to avoid rolling back the PAID status
        }

    }


    @Transactional(readOnly = true)
    public Page<OrderEntity> listUserOrders(Pageable pageable) {

        UUID userId = (UUID) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return orderRepository.findOrdersWithItems(userId, pageable);
    }


    @Transactional(readOnly = true)
    public String resolveProductImage(Long productId) {
        try {
            ProductResponse product = productClient.getProductById(productId);

            // Prefer main image
            if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
                return product.getImageUrl();
            }

            // Fallback to first imageUrls
            if (product.getImageUrls() != null && !product.getImageUrls().isEmpty()) {
                return product.getImageUrls().get(0);
            }

        } catch (FeignException ex) {
            // Fail silently → UI will show placeholder
            return null;
        }
        return null;
    }
    public Page<OrderEntity> listAllOrders(Pageable pageable) {
        return orderRepository.findAllWithItems(pageable);  // ✅
    }




}