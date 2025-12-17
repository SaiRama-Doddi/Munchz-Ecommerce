package com.auth.auth_service.controller;

import com.auth.auth_service.dto.*;
import com.auth.auth_service.entity.User;
import com.auth.auth_service.entity.UserOtp;
import com.auth.auth_service.feign.UserProfileClient;
import com.auth.auth_service.repository.UserRepository;
import com.auth.auth_service.security.JwtProvider;
import com.auth.auth_service.service.EmailService;
import com.auth.auth_service.service.OtpService;
import com.auth.auth_service.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserRepository userRepo;

    @Autowired
    OtpService otpService;

    @Autowired
    JwtProvider jwtProvider;

    @Autowired
    EmailService emailService;

    @Autowired
    RoleService roleService;

    @Autowired
    UserProfileClient userProfileClient;


    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest req) {

        if (userRepo.existsByEmail(req.email())) {
            throw new RuntimeException("Email already registered");
        }

        // 1️⃣ Save user in Auth DB
        User user = new User();
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setEmailVerified(false);
        userRepo.save(user);

        // 2️⃣ Generate INTERNAL JWT (service-to-service)
        String token = jwtProvider.generateToken(
                user.getId(),
                user.getEmail(),
                List.of("USER")
        );

        // 3️⃣ Save firstname & lastname in User Profile Service
        CreateProfileRequest profileReq =
                new CreateProfileRequest(req.firstName(), req.lastName(),req.phone());

        userProfileClient.createOrUpdateProfile(
                "Bearer " + token,
                profileReq
        );

        // 4️⃣ Send welcome email
        emailService.sendWelcomeMail(req.email());

        return Map.of(
                "message", "Thank you for registering 🎉",
                "email", user.getEmail()
        );
    }


    @PostMapping("/verify-otp")
    public String verify(@RequestBody OtpVerifyRequest req){
        User user=otpService.verifyOtp(req.email(),req.otp(),req.purpose());
        //  EMAIL VERIFICATION
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepo.save(user);
        }
      /*  user.setEmailVerified(true);
        userRepo.save(user);*/
        return "OTP Verified";
    }


    @PostMapping("/login-otp")
    public String sendLoginOtp(@RequestBody LoginOtpRequest req){
        User user = userRepo.findByEmail(req.email())
                .orElseThrow(() ->
                        new RuntimeException("Email not exists, please signup")
                );
        otpService.sendOtp(user.getEmail(),"login");
        return "OTP sent for the login";
    }

    @PostMapping("/login-otp/confirm")
    public Map<String, Object> confirmLoginOtp(@RequestBody OtpVerifyRequest req) {

        // Step 1: Validate OTP & get User
        User user = otpService.verifyOtp(req.email(), req.otp(), "login");
        //  Verify email ONLY after OTP success
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepo.save(user);
        }

        // Step 2: Get user roles
        List<String> roles = roleService.getUserRoleNames(user.getId());

        // Step 3: Generate JWT token
        String token = jwtProvider.generateToken(user.getId(), user.getEmail(), roles);

        // Step 4: Call User Profile Service via Feign
        ProfileResponse profile = userProfileClient.getProfile("Bearer " + token);

        // MERGE AUTH + PROFILE DATA
        AuthProfileResponse mergedProfile =
                new AuthProfileResponse(
                        profile.getFirstName(),
                        profile.getLastName(),
                        user.getPhone(),   // mobile
                        user.getEmail()        //  email from auth service
                );
      System.out.println(mergedProfile.mobile());

        // Step 5: Return both token + profile
        return Map.of(
                "token", token,
                "profile", mergedProfile
        );
    }


    @PostMapping("/resend-otp")
    public String resendOtp(@RequestBody ResendOtpRequest req) {
        otpService.resendOtp(req.email(), req.purpose());
        return "OTP resent successfully";
    }

    @PostMapping("/resend-otp/confirm")
    public Map<String, Object> confirmResentOtp(@RequestBody OtpVerifyRequest req) {

        // Step 1: Verify OTP
        User user = otpService.verifyOtp(req.email(), req.otp(), req.purpose());
        //  Verify email ONLY after OTP success
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepo.save(user);
        }


        // Step 2: Get roles
        List<String> roles = roleService.getUserRoleNames(user.getId());

        // Step 3: Generate JWT
        String token = jwtProvider.generateToken(
                user.getId(),
                user.getEmail(),
                roles
        );

        // Step 4: Fetch profile via Feign
        ProfileResponse profile =
                userProfileClient.getProfile("Bearer " + token);

        // Step 5: Return response
        return Map.of(
                "token", token,
                "profile", profile
        );
    }






}
