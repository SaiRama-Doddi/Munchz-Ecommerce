package com.auth.auth_service.service;

import com.auth.auth_service.dto.GoogleUserPayload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoogleTokenVerifier {

    @Value("${google.client-id}")
    private String clientId;

    public GoogleUserPayload verify(String idTokenString) {

        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        new GsonFactory()
                )
                        .setAudience(List.of(clientId))
                        .build();

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            return new GoogleUserPayload(
                    payload.getEmail(),
                    payload.getSubject(),           // GOOGLE USER ID
                    (String) payload.get("given_name"),
                    (String) payload.get("family_name"),
                    payload.getEmailVerified(),
                    (String) payload.get("picture")
            );

        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed");
        }
    }
}
