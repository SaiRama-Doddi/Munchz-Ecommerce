package com.auth.auth_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.UUID;

@Data
public class ProfileResponse {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
  /*  private String email;*/
    @JsonProperty("mobile")
    private String phone;
    private String referralCode;

    public ProfileResponse(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public ProfileResponse() {}
}
