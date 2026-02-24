package com.yourorg.service.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ProfileResponse {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
  /*  private String email;*/
    private String phone;
}
