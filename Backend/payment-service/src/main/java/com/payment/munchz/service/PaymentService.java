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
        boolean keyValid = razorpayKey != null && !razorpayKey.isEmpty() && !razorpayKey.equals("${RAZORPAY_KEY}");
        boolean secretValid = razorpaySecret != null && !razorpaySecret.isEmpty() && !razorpaySecret.equals("${RAZORPAY_SECRET}");

        if (!keyValid) {
            log.error("CRITICAL: Razorpay Key is NOT configured! Check your environment variables (RAZORPAY_KEY). Current value: {}", razorpayKey);
        } else {
            log.info("Razorpay Key correctly initialized (starts with: {})", razorpayKey.substring(0, Math.min(razorpayKey.length(), 6)));
        }

        if (!secretValid) {
            log.error("CRITICAL: Razorpay Secret is NOT configured! Check your environment variables (RAZORPAY_SECRET). Current value: {}", razorpaySecret);
        } else {
            log.info("Razorpay Secret correctly initialized.");
        }
    }

    public CreatePaymentResponse createPayment(CreatePaymentRequest req) throws Exception {

        log.info("Creating payment for orderId: {}, amount: {} {}", req.orderId(), req.amount(), req.currency());

        if (req.amount() < 100) {
            log.warn("Amount {} below minimum of 100 paise for orderId: {}", req.amount(), req.orderId());
            throw new RuntimeException("Minimum order amount is ₹1 (100 paise)");
        }

         Optional<PaymentEntity> existingPayment =
            paymentRepo.findByOrderId(req.orderId());

    if(existingPayment.isPresent()) {
        log.info("Found existing payment for orderId: {}", req.orderId());
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

        return new CreatePaymentResponse(
                razorpayOrderId,
                req.amount(),
                req.currency(),
                razorpayKey
        );
    } catch (com.razorpay.RazorpayException re) {
        log.error("Razorpay SDK Error for order {}: {}", req.orderId(), re.getMessage());
        throw new RuntimeException("Razorpay Error: " + re.getMessage());
    } catch (Exception e) {
        log.error("Internal Payment Error for order {}: {}", req.orderId(), e.getMessage(), e);
        throw new RuntimeException("Internal Payment Service Error: " + e.getMessage());
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
