package com.auth.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtpMail(String to, String otp) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Munchz Login OTP");
        msg.setText(
                "Hello,\n\n" +
                        "Your OTP for Munchz login is: " + otp + "\n" +
                        "This OTP is valid for 1 minute.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "Munchz Team"
        );

        javaMailSender.send(msg);
    }


    /* Welcome / Thank You Email */
    public void sendWelcomeMail(String to) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Welcome to Munchz 🎉");

        msg.setText(
                "Hello,\n\n" +
                        "Thank you for registering with Munchz! \n\n" +
                        "We’re excited to have you on board.\n" +
                        "You can log in anytime using your email and OTP.\n\n" +
                        "If you did not create this account, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "Munchz Team"
        );

        javaMailSender.send(msg);
    }
}
