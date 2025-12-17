package com.yourorg.service.service;

import com.yourorg.service.client.ProductClient;
import com.yourorg.service.dto.OrderItemRequest;
import com.yourorg.service.dto.OrderRequest;
import com.yourorg.service.dto.ProductResponse;
import com.yourorg.service.entity.OrderEntity;
import com.yourorg.service.entity.OrderItemEntity;
import com.yourorg.service.event.OrderCreatedEvent;
import com.yourorg.service.repository.OrderRepository;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher publisher;
    private final ProductClient productClient;

    public OrderService(OrderRepository orderRepository,
                        ApplicationEventPublisher publisher,
                        ProductClient productClient) {
        this.orderRepository = orderRepository;
        this.publisher = publisher;
        this.productClient = productClient;
    }

    @Transactional
    public OrderEntity createOrder(OrderRequest req) {

        OrderEntity order = new OrderEntity();
        order.setUserId(req.getUserId());
        order.setUserName(req.getUserName());
        order.setAddress(req.getAddress());
        order.setOrderStatus("CREATED");

        List<OrderItemEntity> items = req.getItems().stream()
                .map(itemReq -> convertToOrderItem(itemReq, order))
                .collect(Collectors.toList());

        order.setItems(items);

        BigDecimal total = items.stream()
                .map(OrderItemEntity::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);

        OrderEntity saved = orderRepository.save(order);

        publisher.publishEvent(new OrderCreatedEvent(this, saved.getOrderId()));

        return saved;
    }

    @Transactional(readOnly = true)
    public Optional<OrderEntity> getOrder(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Page<OrderEntity> listOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Transactional
    public Optional<OrderEntity> updateOrder(Long id, OrderRequest req) {
        return orderRepository.findById(id).map(existing -> {

            existing.setUserId(req.getUserId());
            existing.setUserName(req.getUserName());
            existing.setAddress(req.getAddress());
            existing.getItems().clear();

            List<OrderItemEntity> items = req.getItems().stream()
                    .map(itemReq -> convertToOrderItem(itemReq, existing))
                    .collect(Collectors.toList());

            existing.setItems(items);

            BigDecimal total = items.stream()
                    .map(OrderItemEntity::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            existing.setTotalAmount(total);

            return orderRepository.save(existing);
        });
    }

    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    private OrderItemEntity convertToOrderItem(OrderItemRequest req, OrderEntity order) {

        // Fetch product info from PRODUCT-SERVICE
        ProductResponse product = productClient.getProductById(req.getProductId());

        // Find variant for correct price & weight
        var variant = product.getVariants().stream()
                .filter(v -> v.getId().equals(req.getVariantId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(
                        "Variant not found for product: " + req.getProductId()
                ));

        OrderItemEntity item = new OrderItemEntity();
        item.setOrder(order);
        item.setProductId(product.getId());
        item.setProductName(product.getName());
        item.setCategoryId(product.getCategoryId());
        item.setCategoryName(product.getCategoryName());

        // Variant details
        item.setVariantWeightInGrams(variant.getWeightInGrams());
        item.setUnitPrice(variant.getOfferPrice());

        // Calculate line total
        BigDecimal qty = BigDecimal.valueOf(req.getQuantityKg());
        BigDecimal price = variant.getOfferPrice();

        item.setQuantityKg(req.getQuantityKg());
        item.setLineTotal(price.multiply(qty));

        return item;
    }
}
