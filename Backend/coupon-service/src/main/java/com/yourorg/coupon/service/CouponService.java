package com.yourorg.coupon.service;

import com.yourorg.coupon.dto.*;

import java.util.List;

public interface CouponService {

    CouponResponse createCoupon(CouponRequest request);

    CouponResponse updateCoupon(Long id, CouponRequest request);

    void deleteCoupon(Long id);

    List<CouponResponse> getAllCoupons();

    // ✅ FIXED
    CouponResponse applyCoupon(String couponCode, Double orderAmount);
}
