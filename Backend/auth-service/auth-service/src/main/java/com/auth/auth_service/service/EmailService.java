package com.auth.auth_service.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String apiKey;

    private final String FROM_EMAIL = "sairamadoddi@gmail.com"; // must be verified in SendGrid

    public void sendOtpMail(String to, String otp) {
        sendMail(to, "Munchz Login OTP",
                "Your OTP is: " + otp + "\nValid for 1 minute.");
    }

    public void sendWelcomeMail(String to) {
        sendMail(to, "Welcome to Munchz 🎉",
                "Thank you for registering with Munchz!");
    }

    private void sendMail(String to, String subject, String body) {
        try {
            Email from = new Email(FROM_EMAIL);
            Email toEmail = new Email(to);
            Content content = new Content("text/plain", body);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            System.out.println("Email sent. Status: " + response.getStatusCode());

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Email sending failed");
        }
    }
}
