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
    private String razorpayKeyInjected;

    @Value("${razorpay.secret}")
    private String razorpaySecretInjected;

    private String getRazorpayKey() {
        if (razorpayKeyInjected == null || razorpayKeyInjected.isBlank() || razorpayKeyInjected.startsWith("${")) {
            return System.getenv("RAZORPAY_KEY");
        }
        return razorpayKeyInjected;
    }

    private String getRazorpaySecret() {
        if (razorpaySecretInjected == null || razorpaySecretInjected.isBlank() || razorpaySecretInjected.startsWith("${")) {
            return System.getenv("RAZORPAY_SECRET");
        }
        return razorpaySecretInjected;
    }

    @jakarta.annotation.PostConstruct
    public void validateConfig() {
        String key = getRazorpayKey();
        String secret = getRazorpaySecret();

        boolean keyValid = key != null && !key.isBlank() && !key.startsWith("${");
        boolean secretValid = secret != null && !secret.isBlank() && !secret.startsWith("${");

        if (!keyValid) {
            log.error("CRITICAL CONFIG ERROR: RAZORPAY_KEY is missing or unresolved! Current: '{}'", key);
        } else {
            String maskedKey = key.length() > 8 ? key.substring(0, 8) + "..." : "Loaded";
            log.info("Razorpay Key successfully resolved: {}", maskedKey);
        }

        if (!secretValid) {
            log.error("CRITICAL CONFIG ERROR: RAZORPAY_SECRET is missing or unresolved!");
        } else {
            log.info("Razorpay Secret successfully resolved.");
        }
    }

    public CreatePaymentResponse createPayment(CreatePaymentRequest req) throws Exception {

        String key = getRazorpayKey();
        
        log.info("--- [CREATE PAYMENT START] for Munchz Order: {} ---", req.orderId());
        log.info("Amount: {} {}, Receipt: {}", req.amount(), req.currency(), req.orderId());

        // Final Diagnostic Check before calling SDK
        if (key == null || key.isBlank() || key.startsWith("${")) {
            log.error("PAYMENT CONFIG ERROR: Razorpay Key is definitively missing or unresolved! Current: '{}'", key);
            throw new RuntimeException("Payment Service Configuration Error: Razorpay Key is missing or invalid. Check .env / Docker environment.");
        }

        if (req.amount() < 100) {
            log.warn("Payment rejected: Amount {} (paise) is below Razorpay minimum of 100 paise.", req.amount());
            throw new RuntimeException("Minimum order amount is ₹1 (100 paise)");
        }

        Optional<PaymentEntity> existingPayment = paymentRepo.findByOrderId(req.orderId());

        if (existingPayment.isPresent()) {
            PaymentEntity payment = existingPayment.get();
            log.info("Found existing Razorpay Order: {} for Munchz Order: {}. Returning it.", payment.getRazorpayOrderId(), req.orderId());
            return new CreatePaymentResponse(
                    payment.getRazorpayOrderId(),
                    payment.getAmount(),
                    payment.getCurrency(),
                    key
            );
        }

        try {
            JSONObject orderReq = new JSONObject();
            orderReq.put("amount", req.amount());
            orderReq.put("currency", req.currency());
            orderReq.put("receipt", req.orderId().toString());

            log.info("Executing Razorpay API Call: orders.create...");
            Order order = razorpayClient.orders.create(orderReq);
            
            if (order == null || !order.has("id")) {
                log.error("Razorpay API returned null or missing ID for order request!");
                throw new RuntimeException("Razorpay API Error: Received invalid response from gateway.");
            }

            String razorpayOrderId = order.get("id");
            log.info("Razorpay Order Created: {}", razorpayOrderId);

            PaymentEntity payment = PaymentEntity.builder()
                    .orderId(req.orderId())
                    .amount(req.amount())
                    .currency(req.currency())
                    .razorpayOrderId(razorpayOrderId)
                    .status("CREATED")
                    .metadata(Map.of("receipt", req.orderId().toString()))
                    .build();

            paymentRepo.save(payment);
            log.info("Payment Record saved to DB for Order: {}", req.orderId());

            return new CreatePaymentResponse(
                    razorpayOrderId,
                    req.amount(),
                    req.currency(),
                    key
            );
        } catch (com.razorpay.RazorpayException re) {
            String msg = re.getMessage();
            log.error("RAZORPAY SDK ERROR (Create Order): {}", msg);
            
            if (msg.toLowerCase().contains("authentication failed")) {
                throw new RuntimeException("Razorpay Auth Failed: Invalid Key/Secret. Check your .env credentials.");
            }
            throw new RuntimeException("Razorpay API Error: " + msg);
        } catch (Exception e) {
            log.error("INTERNAL ERROR in createPayment: {}", e.getMessage(), e);
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
                getRazorpaySecret()
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
