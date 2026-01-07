package com.yourorg.service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ApplyCouponRequest {

    private String couponCode;
    private Double orderAmount;
}
