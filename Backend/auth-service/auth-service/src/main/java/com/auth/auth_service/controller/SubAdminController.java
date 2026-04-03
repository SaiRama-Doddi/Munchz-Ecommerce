package com.auth.auth_service.controller;

import com.auth.auth_service.entity.SubAdmin;
import com.auth.auth_service.entity.SubAdminActivity;
import com.auth.auth_service.service.SubAdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth/subadmin/api")
@RequiredArgsConstructor
public class SubAdminController {

    private final SubAdminService service;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, String> body, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            return ResponseEntity.ok(service.createSubAdmin(body.get("email"), token));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Create error: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> list() {
        try {
            return ResponseEntity.ok(service.getAllSubAdmins());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("List error: " + e.getMessage());
        }
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<SubAdmin> getByEmail(@PathVariable String email) {
        SubAdmin subAdmin = service.getByEmail(email);
        return subAdmin != null ? ResponseEntity.ok(subAdmin) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<SubAdmin> updatePermissions(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updatePermissions(id, body.get("permissions")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteSubAdmin(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activities")
    public ResponseEntity<List<SubAdminActivity>> activities() {
        return ResponseEntity.ok(service.getAllActivities());
    }

    @PostMapping("/log")
    public ResponseEntity<Void> log(@RequestBody Map<String, String> logData) {
        String email = logData.get("email");
        String module = logData.get("module");
        String action = logData.get("action");
        String details = logData.get("details");
        service.logActivity(email, action, module, details);
        return ResponseEntity.ok().build();
    }
}
