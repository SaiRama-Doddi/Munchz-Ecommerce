
package com.yourorg.shipping.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Shipment {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String orderId;
 private String shipmentId;
 private String awbCode;
 private String courier;
 private String trackingUrl;
 private String status;

}
