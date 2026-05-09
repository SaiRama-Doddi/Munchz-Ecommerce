package com.auth.auth_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String LOGO_URL = "https://res.cloudinary.com/dd4oiwnep/image/upload/v1774178657/gomunchz_logo_transparent_r8r0a8.png";
    private static final String PRIMARY_COLOR = "#16a34a"; // Green-600

    public void sendOtpMail(String to, String otp) {
        String content = 
            "<h2 style='color: #111827; margin-bottom: 16px;'>Verify Your Account</h2>" +
            "<p style='color: #4b5563; font-size: 16px; margin-bottom: 24px;'>Use the code below to securely log in to your GoMunchz account.</p>" +
            "<div style='background: white; padding: 24px; border-radius: 12px; display: inline-block; border: 2px dashed #16a34a; margin-bottom: 24px;'>" +
            "  <span style='font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #16a34a;'>" + otp + "</span>" +
            "</div>" +
            "<p style='color: #9ca3af; font-size: 14px;'>This code is valid for <b>1 minute</b>. Please do not share this with anyone.</p>";
        
        sendHtmlMail(to, "Login OTP - GoMunchz", content);
    }

    public void sendWelcomeMail(String to) {
        String content = 
            "<h2 style='color: #111827; margin-bottom: 16px;'>Welcome to the GoMunchz Family! 🎉</h2>" +
            "<p style='color: #4b5563; font-size: 16px; line-height: 1.6;'>" +
            "Thank you for joining GoMunchz! We're excited to have you with us. " +
            "Get ready to explore our premium range of healthy, delicious snacks crafted just for you." +
            "</p>" +
            "<div style='margin-top: 32px;'>" +
            "  <a href='https://gomunchz.com/productpage' style='background: #16a34a; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;'>Start Snacking</a>" +
            "</div>";
        
        sendHtmlMail(to, "Welcome to GoMunchz!", content);
    }

    public void sendSubAdminWelcomeMail(String to) {
        String content = 
            "<h2 style='color: #111827; margin-bottom: 16px;'>Authority Granted 🛡️</h2>" +
            "<p style='color: #4b5563; font-size: 16px; line-height: 1.6;'>" +
            "Congratulations! You have been successfully registered as a <b>Sub-Admin</b> on the GoMunchz Platform.<br><br>" +
            "You can now log in using your secure OTP to manage your assigned modules and contribute to our growth." +
            "</p>" +
            "<div style='margin-top: 32px;'>" +
            "  <a href='https://gomunchz.com/admin' style='background: #111827; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;'>Access Admin Dashboard</a>" +
            "</div>";
        
        sendHtmlMail(to, "Sub-Admin Access Granted - GoMunchz", content);
    }

    private void sendHtmlMail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String htmlBody = 
                "<div style=\"font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb;\">" +
                "  <div style=\"background-color: #ffffff; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);\">" +
                "    <div style=\"margin-bottom: 40px;\">" +
                "      <img src=\"" + LOGO_URL + "\" alt=\"GoMunchz\" style=\"height: 70px;\">" +
                "    </div>" +
                "    " + content + "" +
                "  </div>" +
                "  <div style=\"margin-top: 40px; text-align: center; color: #9ca3af; font-size: 13px;\">" +
                "    <p style=\"margin-bottom: 8px;\">&copy; 2025 GoMunchz. All rights reserved.</p>" +
                "    <p style=\"margin-bottom: 8px;\">Sri Venkateshwara Super Foods LLP, Hyderabad, Telangana</p>" +
                "    <div style=\"margin-top: 16px;\">" +
                "      <a href=\"https://gomunchz.com\" style=\"color: " + PRIMARY_COLOR + "; text-decoration: none; font-weight: 600;\">Visit Website</a>" +
                "      <span style=\"margin: 0 12px;\">&bull;</span>" +
                "      <a href=\"https://gomunchz.com/contact\" style=\"color: " + PRIMARY_COLOR + "; text-decoration: none; font-weight: 600;\">Support</a>" +
                "    </div>" +
                "  </div>" +
                "</div>";

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            helper.setFrom("GoMunchz <gomunchz@gmail.com>");

            mailSender.send(message);
            System.out.println("Premium HTML Email sent successfully ✅");
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
