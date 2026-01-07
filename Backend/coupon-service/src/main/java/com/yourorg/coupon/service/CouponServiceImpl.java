package com.yourorg.coupon.service;

import com.yourorg.coupon.dto.*;
import com.yourorg.coupon.entity.Coupon;
import com.yourorg.coupon.entity.CouponUsageEntity;
import com.yourorg.coupon.repository.CouponRepository;
import com.yourorg.coupon.repository.CouponUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository repository;
    private final CouponUsageRepository usageRepository;

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
    public CouponResponse applyCoupon(String couponCode, Double orderAmount,UUID userId) {

        Coupon coupon = repository
                .findByCodeIgnoreCaseAndActiveTrue(couponCode)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));


        /* ================= REUSE CHECK (ADD HERE) ================= */
       /* UUID userId = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal() instanceof UUID
                ? (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal()
                : null;*/

        if (userId != null &&
                usageRepository.existsByCouponIdAndUserId(coupon.getId(), userId)) {
            throw new RuntimeException("Coupon already used");
        }

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

    @Transactional
    public void markUsed(Long couponId, UUID userId) {

        if (usageRepository.existsByCouponIdAndUserId(couponId, userId)) {
            return; // already used
        }

        CouponUsageEntity usage = new CouponUsageEntity();
        usage.setCouponId(couponId);
        usage.setUserId(userId);

        usageRepository.save(usage);
    }



}
