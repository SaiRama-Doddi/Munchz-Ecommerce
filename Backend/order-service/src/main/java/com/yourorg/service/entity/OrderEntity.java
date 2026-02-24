package com.yourorg.service.entity;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.*;
    import org.hibernate.annotations.JdbcTypeCode;
    import org.hibernate.type.SqlTypes;

    import java.math.BigDecimal;
    import java.time.Instant;
    import java.util.*;

    @Entity
    @Table(name = "orders")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class OrderEntity {

        /* =======================
           PRIMARY KEY (UUID)
        ======================= */
        @Id
        @GeneratedValue
        @Column(columnDefinition = "uuid", nullable = false, updatable = false)
        private UUID id;

        /* =======================
           BASIC ORDER INFO
        ======================= */
        @Column(columnDefinition = "uuid", nullable = false)
        private UUID userId;

        private String userName;
        private String userEmail;
        private String orderStatus;

        @Column(precision = 12, scale = 2)
        private BigDecimal totalAmount;

        /* =======================
           OPTIONAL FIELDS
        ======================= */
        @Column(precision = 12, scale = 2)
        private BigDecimal totalTax;

        @Column(precision = 12, scale = 2)
        private BigDecimal totalDiscount;

        @Column(columnDefinition = "uuid")
        private UUID paymentId;

        private String couponCode;
        private String currency;

        /* =======================
           ADDRESSES (JSONB)
        ======================= */
        @JdbcTypeCode(SqlTypes.JSON)
        @Column(name = "shipping_address", columnDefinition = "jsonb", nullable = false)
        private String shippingAddress;

        @JdbcTypeCode(SqlTypes.JSON)
        @Column(name = "billing_address", columnDefinition = "jsonb", nullable = false)
        private String billingAddress;

        /* =======================
           TIMESTAMPS
        ======================= */
        private Instant placedAt;
        private Instant updatedAt;

        @PrePersist
        public void prePersist() {
            Instant now = Instant.now();
            this.placedAt = now;
            this.updatedAt = now;
        }

        @PreUpdate
        public void preUpdate() {
            this.updatedAt = Instant.now();
        }

        /* =======================
           ORDER ITEMS
        ======================= */
        @OneToMany(
                mappedBy = "order",
                cascade = CascadeType.ALL,
                orphanRemoval = true,
                fetch = FetchType.LAZY
        )
        @JsonIgnore
        private List<OrderItemEntity> items = new ArrayList<>();

        @Column(name = "coupon_id")
        private Integer couponId;   // ✅ CORRECT


    }