
package com.yourorg.coupon.controller;

import com.yourorg.coupon.dto.*;
import com.yourorg.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    public CouponResponse create(@RequestBody CouponRequest request) {
        return couponService.createCoupon(request);
    }

    @PutMapping("/{id}")
    public CouponResponse update(@PathVariable Long id, @RequestBody CouponRequest request) {
        return couponService.updateCoupon(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        couponService.deleteCoupon(id);
    }

    @GetMapping
    public List<CouponResponse> getAll() {
        return couponService.getAllCoupons();
    }

    @PostMapping("/apply")
    public CouponResponse apply(@RequestBody ApplyCouponRequest request) {
        return couponService.applyCoupon(request.orderAmount());
    }
}
