
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
        return repository.findAll().stream().map(this::map).toList();
    }

    @Override
    public CouponResponse applyCoupon(Double orderAmount) {
        return repository.findAll().stream()
                .filter(Coupon::getActive)
                .filter(c -> c.getExpiryDate().isAfter(LocalDate.now()))
                .filter(c -> orderAmount >= c.getMinAmount())
                .findFirst()
                .map(this::map)
                .orElse(null);
    }

    private CouponResponse map(Coupon c) {
        return new CouponResponse(
                c.getId(),
                c.getCode(),
                c.getMinAmount(),
                c.getDiscountAmount(),
                c.getExpiryDate(),
                c.getActive()
        );
    }
}
