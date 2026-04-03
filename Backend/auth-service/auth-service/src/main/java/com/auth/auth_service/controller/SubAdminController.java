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
    public ResponseEntity<SubAdmin> create(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return ResponseEntity.ok(service.createSubAdmin(body.get("email"), token));
    }

    @GetMapping("/list")
    public ResponseEntity<List<SubAdmin>> list() {
        return ResponseEntity.ok(service.getAllSubAdmins());
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
