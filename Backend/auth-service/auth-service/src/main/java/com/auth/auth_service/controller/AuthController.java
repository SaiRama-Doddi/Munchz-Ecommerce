package com.auth.auth_service.controller;

import com.auth.auth_service.dto.*;
import com.auth.auth_service.entity.User;
import com.auth.auth_service.excepton.ResourceNotFoundException;
import com.auth.auth_service.feign.UserProfileClient;
import com.auth.auth_service.repository.UserRepository;
import com.auth.auth_service.security.JwtProvider;
import com.auth.auth_service.service.EmailService;
import com.auth.auth_service.service.GoogleTokenVerifier;
import com.auth.auth_service.service.OtpService;
import com.auth.auth_service.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/internal/sync-subadmin")
    public String syncSubAdmin(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setEmailVerified(true);
            user.setProvider("LOCAL");
            user = userRepo.save(user);
        }

        Integer roleId = roleService.listRoles().stream()
                .filter(r -> r.getName().equals("SUB_ADMIN"))
                .findFirst()
                .map(com.auth.auth_service.entity.Role::getId)
                .orElseGet(() -> roleService.createRole("SUB_ADMIN").getId());

        boolean hasRole = roleService.getUserRoleNames(user.getId()).contains("SUB_ADMIN");
        if (!hasRole) {
            roleService.assignRole(user.getId(), roleId, user.getId()); 
        }

        // 🔥 Send professional welcome email for Sub-Admin
        try {
            emailService.sendSubAdminWelcomeMail(email);
        } catch (Exception e) {
            System.err.println("⚠ Sub-Admin welcome email failed: " + e.getMessage());
        }

        return "Sub-Admin identity synced";
    }

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


/*    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest req) {

        if (userRepo.existsByEmail(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already registered");
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

       // userProfileClient.createProfile(
         //       "Bearer " + token,
           //     profileReq
        //);

        //  Send welcome email
        emailService.sendWelcomeMail(req.email());

        return Map.of(
                "message", "Thank you for registering 🎉",
                "email", user.getEmail()
        );
    }*/
@PostMapping("/register")
public Map<String, Object> register(@RequestBody RegisterRequest req) {

    if (userRepo.existsByEmail(req.email())) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email already registered"
        );
    }

    // Save user
    User user = new User();
    user.setEmail(req.email());
    user.setPhone(req.phone());
    user.setEmailVerified(false);
    userRepo.save(user);

    // Generate internal JWT
    String token = jwtProvider.generateToken(
            user.getId(),
            user.getEmail(),
            List.of("USER")
    );

    // 🔥 SAFE CALL to user-profile-service
    try {
        CreateProfileRequest profileReq =
                new CreateProfileRequest(
                        req.firstName(),
                        req.lastName(),
                        req.phone()
                );

        userProfileClient.createProfile(
                "Bearer " + token,
                profileReq
        );

    } catch (Exception e) {
        System.out.println("⚠ Profile service failed: " + e.getMessage());
    }

    // 🔥 SAFE email sending
    try {
        emailService.sendWelcomeMail(req.email());
    } catch (Exception e) {
        System.out.println("⚠ Email sending failed");
    }

    return Map.of(
            "message", "Registered successfully",
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
                        new ResourceNotFoundException("Email not exists, please signup")
                );
        otpService.sendOtp(user.getEmail(),"login");
        return "OTP sent for the login";
    }

   /*  @PostMapping("/login-otp/confirm")
    public Map<String, Object> confirmLoginOtp(@RequestBody OtpVerifyRequest req) {

     
        User user = otpService.verifyOtp(req.email(), req.otp(), "login");
     
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepo.save(user);
        }

        List<String> roles = roleService.getUserRoleNames(user.getId());

     
        String token = jwtProvider.generateToken(user.getId(), user.getEmail(), roles);

        ProfileResponse profile;
        try {
            profile = userProfileClient.getProfile("Bearer " + token);
        } catch (Exception e) {
            System.out.println("⚠ Profile service down, returning empty profile");
            profile = new ProfileResponse(null, null);
        }


        AuthProfileResponse mergedProfile =
                new AuthProfileResponse(
                        profile.getFirstName(),
                        profile.getLastName(),
                        user.getPhone(),   
                        user.getEmail(),        
                        user.getId()
                );
      System.out.println(mergedProfile.mobile());

        return Map.of(
                "token", token,
                "roles", roles,
                "profile", mergedProfile
        );
    } */








    @PostMapping("/login-otp/confirm")
    public Map<String, Object> confirmLoginOtp(@RequestBody OtpVerifyRequest req) {

    User user = otpService.verifyOtp(req.email(), req.otp(), "login");

    if (!user.isEmailVerified()) {
        user.setEmailVerified(true);
        userRepo.save(user);
    }

    List<String> roles = roleService.getUserRoleNames(user.getId());

    String token = jwtProvider.generateToken(user.getId(), user.getEmail(), roles);

    AuthProfileResponse mergedProfile = null;
    List<AddressResponse> addresses = List.of();

    // ✅ ONLY FETCH PROFILE FOR NORMAL USERS
    if (!roles.contains("ADMIN")) {
    try {

        ProfileResponse profile =
                userProfileClient.getProfile("Bearer " + token);

        addresses =
                userProfileClient.listAddresses("Bearer " + token);

        mergedProfile = new AuthProfileResponse(
                profile.getFirstName(),
                profile.getLastName(),
                user.getPhone(),
                user.getEmail(),
                user.getId()
        );

    } catch (Exception e) {
        System.out.println("⚠ Profile service failed: " + e.getMessage());
    }
}

    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("roles", roles);
    response.put("profile", mergedProfile);
    response.put("addresses", addresses);

    return response;
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
        System.out.println("DEBUG: Entering googleRegister with token: " + (req.idToken() != null ? "PRESENT" : "NULL"));

        // 1️⃣ Verify Google Token
        GoogleUserPayload googleUser =
                googleTokenVerifier.verify(req.idToken());

        // 2️⃣ Check if already registered
        User user = userRepo.findByEmail(googleUser.email()).orElse(null);

        if (user == null) {
            // 3️⃣ Create Auth User (New)
            user = new User();
            user.setEmail(googleUser.email());
            user.setProvider("GOOGLE");
            user.setProviderId(googleUser.googleId());
            user.setEmailVerified(true);
            userRepo.save(user);

            // 5️⃣ INTERNAL JWT for Profile Creation
            String internalToken = jwtProvider.generateToken(
                    user.getId(),
                    user.getEmail(),
                    List.of("USER")
            );

            // 6️⃣ Create profile safely (Only for new users)
            try {
                userProfileClient.patchProfile(
                        "Bearer " + internalToken,
                        new CreateProfileRequest(
                                googleUser.firstName(),
                                googleUser.lastName(),
                                null
                        )
                );
            } catch (Exception e) {
                System.out.println("⚠ Google Register Profile Patch Failed: " + e.getMessage());
            }
        }
        
        List<String> roles = List.of("USER"); // empty
        // 7️⃣ Final login JWT
        String token =
                jwtProvider.generateToken(
                        user.getId(),
                        user.getEmail(),
                        roles
                );

        ProfileResponse profile;
        try {
            profile = userProfileClient.getProfile("Bearer " + token);
        } catch (Exception e) {
            System.out.println("⚠ Google Register Profile Fetch Failed: " + e.getMessage());
            profile = new ProfileResponse(googleUser.firstName(), googleUser.lastName());
        }

        return Map.of(
                "token", token,
                "profile", profile,
                "roles", roles,
                "userId", user.getId()
        );
    }



    @PostMapping({"/google", "/login/google"})
    public ResponseEntity<Map<String, Object>> unifiedGoogleAuth(
            @RequestBody GoogleLoginRequest req
    ) {
        System.out.println("DEBUG: Entering unifiedGoogleAuth with token: " + (req.idToken() != null ? "PRESENT" : "NULL"));
        // 1️⃣ Verify Google token
        GoogleUserPayload googleUser =
                googleTokenVerifier.verify(req.idToken());

        // 2️⃣ Fetch user by email
        User user = userRepo.findByEmail(googleUser.email())
                .orElse(null);

        boolean isNewUser = false;

        if (user == null) {
            // 3️⃣ Auto-register if not found
            user = new User();
            user.setEmail(googleUser.email());
            user.setProvider("GOOGLE");
            user.setProviderId(googleUser.googleId());
            user.setEmailVerified(true);
            userRepo.save(user);
            isNewUser = true;
        } else {
            // 4️⃣ Link account if it was LOCAL/OTP but now using Google
            if (!"GOOGLE".equals(user.getProvider())) {
                user.setProvider("GOOGLE");
                user.setProviderId(googleUser.googleId());
                user.setEmailVerified(true);
                userRepo.save(user);
            }
        }

        // 5️⃣ Generate Internal JWT for profile check/creation
        String internalToken = jwtProvider.generateToken(
                user.getId(),
                user.getEmail(),
                List.of()
        );

        if (isNewUser) {
            // 6️⃣ Create profile for new users
            try {
                userProfileClient.createProfile(
                        "Bearer " + internalToken,
                        new CreateProfileRequest(
                                googleUser.firstName(),
                                googleUser.lastName(),
                                null
                        )
                );
            } catch (Exception e) {
                System.out.println("⚠ Unified Google Auth: Profile creation failed (existing?): " + e.getMessage());
            }
        }

        // 7️⃣ Generate final JWT with roles
        List<String> roles = roleService.getUserRoleNames(user.getId());
        if (roles.isEmpty()) {
            roles = List.of("USER");
        }
        
        String token = jwtProvider.generateToken(
                user.getId(),
                user.getEmail(),
                roles
        );

        // 8️⃣ Fetch full merged profile
        ProfileResponse profile;
        try {
             profile = userProfileClient.getProfile("Bearer " + token);
        } catch (Exception e) {
            profile = new ProfileResponse(googleUser.firstName(), googleUser.lastName());
        }

        AuthProfileResponse mergedProfile = new AuthProfileResponse(
                profile.getFirstName(),
                profile.getLastName(),
                user.getPhone(),
                user.getEmail(),
                user.getId());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "profile", mergedProfile,
                        "roles", roles,
                        "userId", user.getId()
                )
        );
    }


    @PostMapping("/profile")
    public ResponseEntity<ProfileResponse> createProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest req
    ) {
        ProfileResponse profile =
                userProfileClient.createProfile(token, req);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> putProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest req
    ) {
        ProfileResponse profile =
                userProfileClient.putProfile(token, req);

        return ResponseEntity.ok(profile);
    }


    @PatchMapping("/profile")
    public ResponseEntity<ProfileResponse> patchProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest req
    ) {
        ProfileResponse profile =
                userProfileClient.patchProfile(token, req);

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(
            @RequestHeader("Authorization") String token
    ) {
        ProfileResponse profile =
                userProfileClient.getProfile(token);

        return ResponseEntity.ok(profile);
    }



    @PostMapping("/address")
    public AddressResponse addAddress(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateAddressRequest req
    ) {
        return userProfileClient.addAddress(token, req);
    }

    @GetMapping("/address")
    public List<AddressResponse> listAddresses(
            @RequestHeader("Authorization") String token
    ) {
        return userProfileClient.listAddresses(token);
    }


    @PutMapping("/address/{addressId}")
    public AddressResponse update(
            @RequestHeader("Authorization") String token,
            @PathVariable String addressId,
            @RequestBody CreateAddressRequest req
    ) {
        return userProfileClient.updateAddress(token, addressId, req);
    }

    @DeleteMapping("/address/{addressId}")
    public String delete(
            @RequestHeader("Authorization") String token,
            @PathVariable String addressId
    ) {
        return userProfileClient.deleteAddress(token, addressId);
    }
}
