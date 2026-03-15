package com.payment.munchz.service;


import com.payment.munchz.client.OrderClient;
import com.payment.munchz.dto.CreatePaymentRequest;
import com.payment.munchz.dto.CreatePaymentResponse;
import com.payment.munchz.dto.VerifyPaymentRequest;
import com.payment.munchz.entity.PaymentEntity;
import com.payment.munchz.repo.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import com.razorpay.Utils;
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepo;
    private final OrderClient orderClient;

    @Value("${razorpay.key}")
    private String razorpayKey;


    @Value("${razorpay.secret}")
    private String razorpaySecret;

    public CreatePaymentResponse createPayment(CreatePaymentRequest req) throws Exception {

         Optional<PaymentEntity> existingPayment =
            paymentRepo.findByOrderId(req.orderId());

    if(existingPayment.isPresent()) {

        PaymentEntity payment = existingPayment.get();

        return new CreatePaymentResponse(
                payment.getRazorpayOrderId(),
                payment.getAmount(),
                payment.getCurrency(),
                razorpayKey
        );
    } 
        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", req.amount());
        orderReq.put("currency", req.currency());
        orderReq.put("receipt", req.orderId().toString());

        Order order = razorpayClient.orders.create(orderReq);

        PaymentEntity payment = PaymentEntity.builder()
                .orderId(req.orderId())
                .amount(req.amount())
                .currency(req.currency())
                .razorpayOrderId(order.get("id"))
                .status("CREATED")
                .metadata(Map.of("receipt", req.orderId().toString()))
                .build();

        paymentRepo.save(payment);

        return new CreatePaymentResponse(
                order.get("id"),
                req.amount(),
                req.currency(),
                razorpayKey
        );
    }


    
 public void verifyPayment(VerifyPaymentRequest req) {

    PaymentEntity payment = paymentRepo
            .findByRazorpayOrderId(req.razorpayOrderId())
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    // Prevent duplicate verification (idempotency)
    if ("SUCCESS".equals(payment.getStatus())) {
        return;
    }

    try {

        String payload = req.razorpayOrderId() + "|" + req.razorpayPaymentId();

        boolean valid = Utils.verifySignature(
                payload,
                req.razorpaySignature(),
                razorpaySecret
        );

        if (!valid) {
            throw new RuntimeException("Invalid Razorpay Signature");
        }

    } catch (Exception e) {
        throw new RuntimeException("Payment verification failed");
    }

    payment.setRazorpayPaymentId(req.razorpayPaymentId());
    payment.setRazorpaySignature(req.razorpaySignature());
    payment.setStatus("SUCCESS");

    paymentRepo.save(payment);

    // Notify Order Service
    try {

        orderClient.markPaymentSuccess(
                payment.getOrderId(),
                payment.getId()
        );

    } catch (Exception e) {
        System.out.println("CRITICAL ERROR: Order update failed for payment " + payment.getId() + " / order " + payment.getOrderId() + ": " + e.getMessage());
        e.printStackTrace();

        payment.setStatus("REQUIRES_MANUAL_REVIEW");
        paymentRepo.save(payment);
    }
}




    public List<PaymentEntity> getTodayPayments() {

        Instant startOfDay = Instant.now()
                .minusSeconds(Instant.now().getEpochSecond() % 86400);

        return paymentRepo.findByCreatedAtAfter(startOfDay);
    }
}
