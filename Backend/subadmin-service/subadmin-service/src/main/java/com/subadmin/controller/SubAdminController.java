package com.subadmin.controller;

import com.subadmin.entity.SubAdmin;
import com.subadmin.entity.SubAdminActivity;
import com.subadmin.service.SubAdminService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/subadmin")
@RequiredArgsConstructor
public class SubAdminController {

    private final SubAdminService service;
    private final com.subadmin.repository.SubAdminRepository subAdminRepository;

    // ADMIN ONLY ENDPOINTS
    @PostMapping("/create")
    public ResponseEntity<SubAdmin> create(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(service.createSubAdmin(request.get("email")));
    }

    @GetMapping("/list")
    public ResponseEntity<List<SubAdmin>> list() {
        return ResponseEntity.ok(service.getAllSubAdmins());
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<SubAdmin> getByEmail(@PathVariable String email) {
        return subAdminRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<SubAdmin> updatePermissions(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(service.updatePermissions(id, request.get("permissions")));
    }

    @GetMapping("/activities")
    public ResponseEntity<List<SubAdminActivity>> activities() {
        return ResponseEntity.ok(service.getAllActivities());
    }

    // ACTIVITY LOGGING (Called by Gateway/Other services)
    @PostMapping("/log")
    public ResponseEntity<Void> log(@RequestBody Map<String, String> logData) {
        String email = logData.get("email");
        String module = logData.get("module");
        String action = logData.get("action");
        String details = logData.get("details");
        
        // Find sub-admin if exists to get UUID
        service.logActivity(null, email, action, module, null, details);
        return ResponseEntity.ok().build();
    }
}
