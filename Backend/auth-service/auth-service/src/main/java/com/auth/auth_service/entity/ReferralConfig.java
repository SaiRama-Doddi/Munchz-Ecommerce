package com.auth.auth_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "referral_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReferralConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reward_percentage")
    private Double rewardPercentage;

    @Column(name = "fixed_amount")
    private Double fixedAmount;

    @Column(name = "minimum_order_amount")
    private Double minimumOrderAmount;

    @Column(name = "is_active")
    private Boolean isActive;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
