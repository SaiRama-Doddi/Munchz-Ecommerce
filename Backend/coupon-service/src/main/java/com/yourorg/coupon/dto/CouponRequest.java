
package com.yourorg.coupon.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CouponRequest(
        @NotBlank String code,
        @NotNull Double minAmount,
        @NotNull Double discountAmount,
        @NotNull LocalDate expiryDate,
        Boolean active
) {}
