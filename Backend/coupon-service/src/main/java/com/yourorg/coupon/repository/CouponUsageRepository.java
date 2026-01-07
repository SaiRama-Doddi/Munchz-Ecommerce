package com.yourorg.coupon.repository;

import com.yourorg.coupon.entity.CouponUsageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsageEntity, Long> {

    boolean existsByCouponIdAndUserId(Long couponId, UUID userId);
}
