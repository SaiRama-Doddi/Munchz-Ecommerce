package com.yourorg.service.client;

import com.yourorg.service.dto.ApplyCouponRequest;
import com.yourorg.service.dto.CouponResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "coupon-service", url = "https://coupon-service-hsun.onrender.com")
public interface CouponClient {

    @PostMapping("/api/coupons/apply")
    CouponResponse applyCoupon(
            @RequestBody ApplyCouponRequest request,
            @RequestHeader("X-USER-ID") UUID userId
    );

    @PostMapping("/api/coupons/mark-used")
    void markCouponUsed(
            @RequestParam Long couponId,
            @RequestParam UUID userId
    );
}

