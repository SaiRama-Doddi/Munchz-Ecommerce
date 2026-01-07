package com.yourorg.coupon.service;

import com.yourorg.coupon.dto.*;
import com.yourorg.coupon.entity.Coupon;
import com.yourorg.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository repository;

    @Override
    public CouponResponse createCoupon(CouponRequest request) {
        Coupon coupon = Coupon.builder()
                .code(request.code())
                .minAmount(request.minAmount())
                .discountAmount(request.discountAmount())
                .expiryDate(request.expiryDate())
                .active(request.active())
                .build();

        return map(repository.save(coupon));
    }

    @Override
    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        coupon.setCode(request.code());
        coupon.setMinAmount(request.minAmount());
        coupon.setDiscountAmount(request.discountAmount());
        coupon.setExpiryDate(request.expiryDate());
        coupon.setActive(request.active());

        return map(repository.save(coupon));
    }

    @Override
    public void deleteCoupon(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<CouponResponse> getAllCoupons() {
        return repository.findAll().stream()
                .map(this::map)
                .toList();
    }

    // ================= APPLY COUPON =================
    @Override
    public CouponResponse applyCoupon(String couponCode, Double orderAmount) {

        Coupon coupon = repository
                .findByCodeIgnoreCaseAndActiveTrue(couponCode)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));

        // ✅ Safe expiry check
        if (coupon.getExpiryDate() != null &&
                coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Coupon expired");
        }

        // ✅ Minimum order check
        if (coupon.getMinAmount() != null &&
                orderAmount < coupon.getMinAmount()) {
            throw new RuntimeException(
                    "Minimum order amount ₹" + coupon.getMinAmount()
            );
        }

        // ✅ Safe discount calculation
        double discount = coupon.getDiscountAmount() != null
                ? coupon.getDiscountAmount()
                : 0.0;

        double finalAmount = Math.max(orderAmount - discount, 0);

        return new CouponResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getMinAmount(),
                coupon.getDiscountAmount(),
                coupon.getExpiryDate(),
                coupon.getActive(),
                discount,
                finalAmount
        );
    }

    private CouponResponse map(Coupon c) {
        return new CouponResponse(
                c.getId(),
                c.getCode(),
                c.getMinAmount(),
                c.getDiscountAmount(),
                c.getExpiryDate(),
                c.getActive(),
                null,
                null
        );
    }
}
