package com.user.user_profile_service.dto;

public record UpdateProfileRequest( String firstName,
                                    String lastName,
                                    String mobile) {
}
