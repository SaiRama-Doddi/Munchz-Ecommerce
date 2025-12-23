package com.auth.auth_service.controller;

import com.auth.auth_service.dto.*;
import com.auth.auth_service.entity.User;
import com.auth.auth_service.entity.UserOtp;
import com.auth.auth_service.feign.UserProfileClient;
import com.auth.auth_service.repository.UserRepository;
import com.auth.auth_service.security.JwtProvider;
import com.auth.auth_service.service.EmailService;
import com.auth.auth_service.service.GoogleTokenVerifier;
import com.auth.auth_service.service.OtpService;
import com.auth.auth_service.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    GoogleTokenVerifier googleTokenVerifier;


    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest req) {

        if (userRepo.existsByEmail(req.email())) {
            throw new RuntimeException("Email already registered");
        }

        // Save user in Auth DB
        User user = new User();
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setEmailVerified(false);
        userRepo.save(user);

        //  Generate INTERNAL JWT (service-to-service)
        String token = jwtProvider.generateToken(
                user.getId(),
                user.getEmail(),
                List.of("USER")
        );

        // Save firstname & lastname in User Profile Service
        CreateProfileRequest profileReq =
                new CreateProfileRequest(req.firstName(), req.lastName(),req.phone());

        userProfileClient.createOrUpdateProfile(
                "Bearer " + token,
                profileReq
        );

        //  Send welcome email
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
                "roles", roles,
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
                "profile", profile,
                "roles", roles
                );
    }


    @PostMapping("/register/google")
    public Map<String, Object> googleRegister(
            @RequestBody GoogleLoginRequest req
    ) {

        // 1️⃣ Verify Google Token
        GoogleUserPayload googleUser =
                googleTokenVerifier.verify(req.idToken());

        // 2️⃣ Check if already registered
        if (userRepo.existsByEmail(googleUser.email())) {
            throw new RuntimeException(
                    "Account already exists. Please login."
            );
        }

        // 3️⃣ Create Auth User
        User user = new User();
        user.setEmail(googleUser.email());
        user.setProvider("GOOGLE");
        user.setProviderId(googleUser.googleId());
        user.setEmailVerified(true);

        userRepo.save(user);



        // 5️⃣ INTERNAL JWT (service-to-service)
        String internalToken =
                jwtProvider.generateToken(
                        user.getId(),
                        user.getEmail(),
                        List.of()
                );

        // 6️⃣ Create profile
        userProfileClient.createOrUpdateProfile(
                "Bearer " + internalToken,
                new CreateProfileRequest(
                        googleUser.firstName(),
                        googleUser.lastName(),
                        null
                )
        );
        List<String> roles = List.of(); // empty
        // 7️⃣ Final login JWT
        String token =
                jwtProvider.generateToken(
                        user.getId(),
                        user.getEmail(),
                        List.of("USER")
                );

        ProfileResponse profile =
                userProfileClient.getProfile("Bearer " + token);

        return Map.of(
                "token", token,
                "profile", profile
        );
    }



    @PostMapping("/login/google")
    public ResponseEntity<Map<String, Object>> googleLogin(
            @RequestBody GoogleLoginRequest req
    ) {

        // 1️⃣ Verify Google token
        GoogleUserPayload googleUser =
                googleTokenVerifier.verify(req.idToken());

        // 2️⃣ Fetch user
        User user = userRepo.findByEmail(googleUser.email())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "User not registered. Please signup.")
            );
        }

        // 3️⃣ Provider check (SAFE)
        if (user.getProvider() == null || !"GOOGLE".equals(user.getProvider())) {
            return ResponseEntity.status(400).body(
                    Map.of("message", "This email is registered using OTP login.")
            );
        }

        // 4️⃣ Generate JWT (no roles)
        String token =
                jwtProvider.generateToken(
                        user.getId(),
                        user.getEmail(),
                        List.of()
                );

        // 5️⃣ Fetch profile
        ProfileResponse profile =
                userProfileClient.getProfile("Bearer " + token);

        AuthProfileResponse mergedProfile =
                new AuthProfileResponse(
                        profile.getFirstName(),
                        profile.getLastName(),
                        user.getPhone(),
                        user.getEmail()
                );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "profile", mergedProfile
                )
        );
    }



}
