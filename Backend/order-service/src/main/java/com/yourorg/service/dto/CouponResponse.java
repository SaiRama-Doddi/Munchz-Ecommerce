
package com.yourorg.service.dto;

import java.time.LocalDate;


public record CouponResponse(
        Long id,
        String code,
        Double minAmount,
        Double discountAmount,
        LocalDate expiryDate,
        Boolean active,
        Double appliedDiscount,
        Double finalAmount
) {}

