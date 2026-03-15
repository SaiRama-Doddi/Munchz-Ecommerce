package com.yourorg.service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShipmentRequest {
    private String orderId;
    private String customerName;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private double price;
}
