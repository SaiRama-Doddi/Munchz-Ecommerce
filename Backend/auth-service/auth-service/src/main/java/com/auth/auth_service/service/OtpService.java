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


    @Transactional
    public void sendOtp(String email,String purpose){

        User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));
        userOtpRepository.deleteByUserIdAndPurpose(user.getId(), purpose);

        String otp=String.valueOf(new Random().nextInt(900000)+100000);
        String hash= DigestUtils.sha256Hex(otp);
        UserOtp otpRecord=new UserOtp();
        otpRecord.setUserId(user.getId());
        otpRecord.setOtpHash(hash);
        otpRecord.setPurpose(purpose);
        otpRecord.setExpiresAt(Instant.now().plus(1, ChronoUnit.MINUTES));  // REQUIRED
        otpRecord.setConsumed(false);

        userOtpRepository.save(otpRecord);
        emailService.sendOtpMail(email,otp);
    }


    @Transactional
    public void resendOtp(String email, String purpose) {
        sendOtp(email, purpose);
    }


    public User verifyOtp(String email,String otp,String purpose){
            System.out.println("VERIFY OTP EMAIL = [" + email + "]");

        User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("user email not found"));
        UserOtp otpRec=userOtpRepository.findAllByUserIdAndPurposeAndConsumedFalseOrderByExpiresAtDesc(user.getId(),purpose)
                .orElseThrow(()->new RuntimeException("invalid otp"));

   if(Instant.now().isAfter(otpRec.getExpiresAt()))
       throw  new RuntimeException("OTP expired");

   if(!DigestUtils.sha256Hex(otp).equals(otpRec.getOtpHash()))
       throw new RuntimeException("invalid Otp");

   otpRec.setConsumed(true);
        userOtpRepository.save(otpRec);
        return user;
    }
}
