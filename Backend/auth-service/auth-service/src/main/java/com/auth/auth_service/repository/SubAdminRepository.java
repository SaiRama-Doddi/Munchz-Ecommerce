package com.auth.auth_service.repository;

import com.auth.auth_service.entity.SubAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface SubAdminRepository extends JpaRepository<SubAdmin, UUID> {
    Optional<SubAdmin> findByEmail(String email);
    boolean existsByEmail(String email);
}
