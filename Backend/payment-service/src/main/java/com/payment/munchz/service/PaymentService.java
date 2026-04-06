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
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepo;
    private final OrderClient orderClient;

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @jakarta.annotation.PostConstruct
    public void validateConfig() {
        boolean keyValid = razorpayKey != null && !razorpayKey.isEmpty() && !razorpayKey.startsWith("${");
        boolean secretValid = razorpaySecret != null && !razorpaySecret.isEmpty() && !razorpaySecret.startsWith("${");

        if (!keyValid) {
            log.error("CRITICAL CONFIG ERROR: RAZORPAY_KEY is missing or incorrectly mapped! Check your environment variables. Current: {}", razorpayKey);
        } else {
            log.info("Razorpay Key successfully loaded: {}...{}", razorpayKey.substring(0, 8), razorpayKey.substring(razorpayKey.length() - 4));
        }

        if (!secretValid) {
            log.error("CRITICAL CONFIG ERROR: RAZORPAY_SECRET is missing or incorrectly mapped! Check your environment variables.");
        } else {
            log.info("Razorpay Secret successfully loaded (verified presence).");
        }
    }

    public CreatePaymentResponse createPayment(CreatePaymentRequest req) throws Exception {

        log.info("Initiating payment creation for Order: {}", req.orderId());

        // Diagnostic Check: Ensure keys are not literal placeholders
        if (razorpayKey == null || razorpayKey.startsWith("${")) {
            log.error("PAYMENT CONFIG ERROR: razorpay.key is not correctly resolved! Current value: {}", razorpayKey);
            throw new RuntimeException("Payment Service Configuration Error: Invalid API Key");
        }

        if (req.amount() < 100) {
            log.warn("Payment rejected: Amount {} (paise) is below Razorpay minimum of 100 paise.", req.amount());
            throw new RuntimeException("Minimum order amount is ₹1");
        }

         Optional<PaymentEntity> existingPayment =
            paymentRepo.findByOrderId(req.orderId());

    if(existingPayment.isPresent()) {
        log.info("Returning existing Razorpay Order for Munchz Order: {}", req.orderId());
        PaymentEntity payment = existingPayment.get();

        return new CreatePaymentResponse(
                payment.getRazorpayOrderId(),
                payment.getAmount(),
                payment.getCurrency(),
                razorpayKey
        );
    } 

    try {
        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", req.amount());
        orderReq.put("currency", req.currency());
        orderReq.put("receipt", req.orderId().toString());

        log.info("Calling Razorpay API (orders.create) for Order ID: {} with Receipt: {}", req.orderId(), req.orderId());
        Order order = razorpayClient.orders.create(orderReq);
        String razorpayOrderId = order.get("id");

        PaymentEntity payment = PaymentEntity.builder()
                .orderId(req.orderId())
                .amount(req.amount())
                .currency(req.currency())
                .razorpayOrderId(razorpayOrderId)
                .status("CREATED")
                .metadata(Map.of("receipt", req.orderId().toString()))
                .build();

        paymentRepo.save(payment);

        log.info("Successfully created Razorpay Order: {} for Munchz Order: {}", razorpayOrderId, req.orderId());

        return new CreatePaymentResponse(
                razorpayOrderId,
                req.amount(),
                req.currency(),
                razorpayKey
        );
    } catch (com.razorpay.RazorpayException re) {
        String msg = re.getMessage();
        log.error("RAZORPAY SDK EXCEPTION (Create Order): {}", msg);
        
        if (msg.contains("Authentication failed")) {
            throw new RuntimeException("Payment Gateway Error: Invalid Credentials (Check RAZORPAY_KEY/SECRET)");
        }
        throw new RuntimeException("Razorpay failure: " + msg);
    } catch (Exception e) {
        log.error("INTERNAL PAYMENT FAULT during order creation: {}", e.getMessage(), e);
        throw new RuntimeException("Internal Payment Service Fault: " + e.getMessage());
    }
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
        log.error("CRITICAL ERROR: Order update failed for payment {} / order {}: {}", payment.getId(), payment.getOrderId(), e.getMessage(), e);

        payment.setStatus("REQUIRES_MANUAL_REVIEW");
        paymentRepo.save(payment);
    }
}




    public List<PaymentEntity> getTodayPayments() {

        Instant startOfDay = Instant.now()
                .minusSeconds(Instant.now().getEpochSecond() % 86400);

        return paymentRepo.findByCreatedAtAfter(startOfDay);
    }

    public List<PaymentEntity> getAllPayments() {
        return paymentRepo.findAll();
    }
}
