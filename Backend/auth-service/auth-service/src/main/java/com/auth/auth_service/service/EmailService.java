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

    public void sendSubAdminWelcomeMail(String to) {
        sendMail(to, "Munchz Sub-Admin Authority Granted 🛡️",
                "Congratulations!\n\nYou have been successfully registered as a Sub-Admin on the Munchz Platform.\n" +
                "You can now log in using your email and a secure OTP to manage assigned modules.\n\n" +
                "Successfully you are now a Sub-Admin!");
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
