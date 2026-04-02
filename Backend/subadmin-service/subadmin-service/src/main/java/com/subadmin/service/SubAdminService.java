package com.subadmin.service;

import com.subadmin.entity.SubAdmin;
import com.subadmin.entity.SubAdminActivity;
import java.util.List;
import java.util.UUID;

public interface SubAdminService {
    SubAdmin createSubAdmin(String email);
    SubAdmin verifyOtpAndActivate(String email, String otp);
    void requestLoginOtp(String email);
    String verifyLoginOtpAndGetToken(String email, String otp);
    List<SubAdmin> getAllSubAdmins();
    SubAdmin updatePermissions(UUID id, String permissions);
    List<SubAdminActivity> getAllActivities();
    void logActivity(UUID subAdminId, String email, String action, String module, String targetId, String details);
}
