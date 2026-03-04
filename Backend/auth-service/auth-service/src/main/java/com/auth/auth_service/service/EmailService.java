package com.auth.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpMail(String to, String otp) {
        sendMail(to, "Munchz Login OTP",
                "Your OTP is: " + otp + "\nValid for 1 minute.");
    }

    public void sendWelcomeMail(String to) {
        sendMail(to, "Welcome to Munchz 🎉",
                "Thank you for registering with Munchz!");
    }

    private void sendMail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

        System.out.println("Email sent successfully via Gmail SMTP ✅");
    }
}
