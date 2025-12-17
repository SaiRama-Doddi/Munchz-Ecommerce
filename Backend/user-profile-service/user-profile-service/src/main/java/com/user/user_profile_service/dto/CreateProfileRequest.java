package com.user.user_profile_service.dto;

public record CreateProfileRequest( String firstName,
                                    String lastName,
                                    String mobile
                                   ) {
}
