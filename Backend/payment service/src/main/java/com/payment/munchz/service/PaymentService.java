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

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepo;
    private final OrderClient orderClient;

    @Value("${razorpay.key}")
    private String razorpayKey;

    public CreatePaymentResponse createPayment(CreatePaymentRequest req) throws Exception {

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

        PaymentEntity payment = paymentRepo.findByRazorpayOrderId(req.razorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setRazorpayPaymentId(req.razorpayPaymentId());
        payment.setRazorpaySignature(req.razorpaySignature());
        payment.setStatus("SUCCESS");

        paymentRepo.save(payment);

// 🔥 Notify Order Service
        orderClient.markPaymentSuccess(
                payment.getOrderId(),
                payment.getId()
        );

        // TODO: Call Order Service → mark order as PAID
    }
}
