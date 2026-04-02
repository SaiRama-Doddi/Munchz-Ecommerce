package com.subadmin.repository;

import com.subadmin.entity.SubAdminActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SubAdminActivityRepository extends JpaRepository<SubAdminActivity, UUID> {
    List<SubAdminActivity> findBySubAdminIdOrderByTimestampDesc(UUID subAdminId);
    List<SubAdminActivity> findAllByOrderByTimestampDesc();
}
