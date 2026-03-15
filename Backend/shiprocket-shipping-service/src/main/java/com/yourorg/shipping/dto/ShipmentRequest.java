
package com.yourorg.shipping.dto;

import lombok.Data;

@Data
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
