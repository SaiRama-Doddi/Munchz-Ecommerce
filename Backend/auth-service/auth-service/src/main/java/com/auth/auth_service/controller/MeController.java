package com.auth.auth_service.controller;

import com.auth.auth_service.dto.UserMeResponse;
import com.auth.auth_service.feign.UserProfileClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class MeController {

    @Autowired
    private UserProfileClient userProfileClient;

    @GetMapping("/me")
    public UserMeResponse me(
            @RequestHeader("Authorization") String token
    ) {
        UserMeResponse res = new UserMeResponse();
        res.setProfile(userProfileClient.getProfile(token));
        res.setAddresses(userProfileClient.listAddresses(token));
        return res;
    }
}

