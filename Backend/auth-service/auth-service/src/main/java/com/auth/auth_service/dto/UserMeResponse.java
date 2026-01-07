package com.auth.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserMeResponse {
    private ProfileResponse profile;
    private List<AddressResponse> addresses;

    public UserMeResponse() {

    }

    // getters & setters
}