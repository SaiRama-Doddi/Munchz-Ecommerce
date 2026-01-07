package com.yourorg.coupon.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "coupon_usage",
        uniqueConstraints = @UniqueConstraint(columnNames = {"coupon_id", "user_id"})
)
@Data
public class CouponUsageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long couponId;

    @Column(columnDefinition = "uuid")
    private UUID userId;

    private Instant usedAt = Instant.now();
}

