package com.auth.auth_service.controller;

import com.auth.auth_service.dto.AssignPermissionRequest;
import com.auth.auth_service.dto.AssignRoleRequest;
import com.auth.auth_service.dto.CreatePermissionRequest;
import com.auth.auth_service.dto.CreateRoleRequest;
import com.auth.auth_service.entity.Permission;
import com.auth.auth_service.entity.Role;
import com.auth.auth_service.entity.UserRole;
import com.auth.auth_service.service.PermissionService;
import com.auth.auth_service.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/roles")
public class AdminRoleController {

    @Autowired
    RoleService roleService;

    @Autowired
    PermissionService permissionService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public Role createRole(@RequestBody CreateRoleRequest req){
        return roleService.createRole(req.name());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign-role")
    public String assignRole(@RequestBody AssignRoleRequest req){
        roleService.assignRole(req.userId(),req.roleId(),req.assignedBy());
        return "Role Assigned";
    }

    @GetMapping("/list-roles")
    public List<Role> listRoles(){
        return roleService.listRoles();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-permission")
    public Permission createPermission(@RequestBody CreatePermissionRequest req){
       return permissionService.createPermission(req.name(),req.description());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign-permission")
    public String assignPermisson(@RequestBody AssignPermissionRequest req){
        permissionService.assignPermissionToRole(req.roleId(),req.permissionId());
        return "Permssion Assgned To Role";
    }

    @GetMapping("/{roleId}/permissions")
    public List<Permission> getRolePermisson(@PathVariable Integer roleId){
        return permissionService.getPermissionForRole(roleId);
    }
}
