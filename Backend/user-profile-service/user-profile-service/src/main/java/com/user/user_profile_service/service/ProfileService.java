package com.user.user_profile_service.service;

import com.user.user_profile_service.dto.CreateProfileRequest;
import com.user.user_profile_service.entity.Profile;
import com.user.user_profile_service.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    ProfileRepository profileRepository;

    public Profile createProfile(UUID user_id, CreateProfileRequest req){
        Profile profile=profileRepository.findByUserId(user_id).orElse(new Profile());
        profile.setUserId(user_id);
        profile.setFirstName(req.firstName());
        profile.setLastName(req.lastName());
        profile.setMobile(req.mobile());
 /*       profile.setDob(LocalDate.parse(req.dob()));*/

        return profileRepository.save(profile);

    }

    public Profile getProfile(UUID userId){
    return profileRepository.findByUserId(userId).orElseThrow(()->new RuntimeException("Profile not found"));
    }
}
