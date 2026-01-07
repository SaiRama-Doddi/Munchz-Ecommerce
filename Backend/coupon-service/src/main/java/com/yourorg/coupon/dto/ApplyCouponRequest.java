package com.yourorg.coupon.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyCouponRequest {

    private String couponCode;
    private Double orderAmount;
}
