package com.auth.auth_service.service;

import com.auth.auth_service.entity.User;
import com.auth.auth_service.entity.UserOtp;
import com.auth.auth_service.repository.UserOtpRepository;
import com.auth.auth_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserOtpRepository userOtpRepository;

    // ============================
    // SEND OTP
    // ============================
    @Transactional
    public void sendOtp(String email, String purpose) {

        try {
            System.out.println("STEP 1: sendOtp started");
            System.out.println("Email: " + email);
            System.out.println("Purpose: " + purpose);

            // 1️⃣ Fetch user
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 2️⃣ Delete old OTPs for same purpose
            userOtpRepository.deleteByUserIdAndPurpose(user.getId(), purpose);

            // 3️⃣ Generate OTP
            String otp = String.valueOf(new Random().nextInt(900000) + 100000);
            System.out.println("Generated OTP: " + otp);

            // 4️⃣ Hash OTP
            String hash = DigestUtils.sha256Hex(otp);

            // 5️⃣ Save OTP in DB
            UserOtp otpRecord = new UserOtp();
            otpRecord.setUserId(user.getId());
            otpRecord.setOtpHash(hash);
            otpRecord.setPurpose(purpose);
            otpRecord.setExpiresAt(Instant.now().plus(1, ChronoUnit.MINUTES));
            otpRecord.setConsumed(false);

            userOtpRepository.save(otpRecord);
            System.out.println("OTP saved in DB");

            // 6️⃣ Send OTP email
            emailService.sendOtpMail(email, otp);
            System.out.println("OTP email sent successfully ✅");

        } catch (Exception e) {
            System.out.println("❌ ERROR WHILE SENDING OTP");
            e.printStackTrace();
            throw e; // important so frontend knows failure
        }
    }

    // ============================
    // RESEND OTP
    // ============================
    @Transactional
    public void resendOtp(String email, String purpose) {
        sendOtp(email, purpose);
    }

    // ============================
    // VERIFY OTP
    // ============================
    @Transactional
    public User verifyOtp(String email, String otp, String purpose) {

        System.out.println("VERIFY OTP EMAIL = [" + email + "]");

        // 1️⃣ Fetch user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User email not found"));

        // 2️⃣ Fetch latest unconsumed OTP
        UserOtp otpRec = userOtpRepository
                .findAllByUserIdAndPurposeAndConsumedFalseOrderByExpiresAtDesc(
                        user.getId(), purpose
                )
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        // 3️⃣ Check expiry
        if (Instant.now().isAfter(otpRec.getExpiresAt())) {
            throw new RuntimeException("OTP expired");
        }

        // 4️⃣ Check OTP match
        if (!DigestUtils.sha256Hex(otp).equals(otpRec.getOtpHash())) {
            throw new RuntimeException("Invalid OTP");
        }

        // 5️⃣ Mark OTP consumed
        otpRec.setConsumed(true);
        userOtpRepository.save(otpRec);

        return user;
    }
}
