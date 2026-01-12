package com.yourorg.service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemEntity {

    @Id
    @Column(columnDefinition = "uuid", nullable = false, updatable = false)
    @GeneratedValue
    private UUID id;


    private Long productId;
    private String skuId;           // internal SKU


    @Column(name = "variant_label")
    private String variantLabel;   //  INVENTORY USES THIS

    private String productName;

    private BigDecimal unitPrice;
    @Column(precision = 10, scale = 2)
    private BigDecimal quantity;
    private BigDecimal lineTotal;

    private BigDecimal taxAmount;
    private BigDecimal discountAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private OrderEntity order;


}
