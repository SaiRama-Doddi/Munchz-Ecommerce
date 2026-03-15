
package com.yourorg.shipping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.yourorg.shipping.entity.Shipment;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
}
