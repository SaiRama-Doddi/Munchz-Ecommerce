package com.user.user_profile_service.service;

import com.user.user_profile_service.dto.CreateProfileRequest;
import com.user.user_profile_service.entity.Profile;
import com.user.user_profile_service.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    /* ===================== CREATE ===================== */
    public Profile createProfile(UUID userId, CreateProfileRequest req) {

        if (profileRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Profile already exists");
        }

        Profile profile = new Profile();
        profile.setUserId(userId);
        profile.setFirstName(req.firstName());
        profile.setLastName(req.lastName());
        profile.setMobile(req.mobile());

        return profileRepository.save(profile);
    }

    /* ===================== GET ===================== */
    public Profile getProfile(UUID userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    /* ===================== PUT (FULL REPLACE) ===================== */
    public Profile putProfile(UUID userId, CreateProfileRequest req) {

        Profile profile = profileRepository
                .findByUserId(userId)
                .orElse(new Profile());

        profile.setUserId(userId);
        profile.setFirstName(req.firstName());
        profile.setLastName(req.lastName());
        profile.setMobile(req.mobile());

        return profileRepository.save(profile);
    }

    /* ===================== PATCH (PARTIAL UPDATE) ===================== */
    public Profile patchProfile(UUID userId, CreateProfileRequest req) {

        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (req.firstName() != null)
            profile.setFirstName(req.firstName());

        if (req.lastName() != null)
            profile.setLastName(req.lastName());

        if (req.mobile() != null)
            profile.setMobile(req.mobile());

        return profileRepository.save(profile);
    }
}
