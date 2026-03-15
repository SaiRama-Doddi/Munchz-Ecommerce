
package com.yourorg.shipping.controller;

import org.springframework.web.bind.annotation.*;

import com.yourorg.shipping.dto.ShipmentRequest;
import com.yourorg.shipping.service.ShippingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/shipping")
@RequiredArgsConstructor
public class ShippingController {

 private final ShippingService shippingService;

 @PostMapping("/create")
 public Object createShipment(@RequestBody ShipmentRequest request){
  return shippingService.createShipment(request);
 }

 @GetMapping("/track/{shipmentId}")
 public Object trackShipment(@PathVariable String shipmentId) {
  return shippingService.getTrackingInfo(shipmentId);
 }

}
