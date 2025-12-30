
package com.yourorg.coupon.dto;

import java.time.LocalDate;

public record CouponResponse(
        Long id,
        String code,
        Double minAmount,
        Double discountAmount,
        LocalDate expiryDate,
        Boolean active
) {}
