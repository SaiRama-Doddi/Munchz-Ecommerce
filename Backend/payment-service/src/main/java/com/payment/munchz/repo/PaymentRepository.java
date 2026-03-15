package com.payment.munchz.repo;




import com.payment.munchz.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<PaymentEntity, UUID> {

    Optional<PaymentEntity> findByRazorpayOrderId(String razorpayOrderId);

    Optional<PaymentEntity> findByOrderId(UUID orderId);
    List<PaymentEntity> findByCreatedAtAfter(Instant startOfDay);
}