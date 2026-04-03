package com.auth.auth_service.service;

import com.auth.auth_service.entity.Role;
import com.auth.auth_service.entity.UserRole;
import com.auth.auth_service.repository.RoleRepository;
import com.auth.auth_service.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRoleRepository userRoleRepository;

    public Role createRole(String name){
        Role role=new Role();
        role.setName(name);
       return roleRepository.save(role);
    }

    public void assignRole(UUID userId, Integer roleId, UUID assignedBy) {
        UserRole.UserRoleId id = new UserRole.UserRoleId();
        id.setUserId(userId);
        id.setRoleId(roleId);

        if (userRoleRepository.existsById(id)) {
            return; // Already assigned, do nothing
        }

        UserRole userRole = new UserRole();
        userRole.setId(id);
        userRole.setAssignedBy(assignedBy);
        userRoleRepository.save(userRole);
    }
    public List<Role> listRoles(){
        return roleRepository.findAll();
    }


    public List<String> getUserRoleNames(UUID userId) {
        return userRoleRepository.findRolesByUserId(userId);
    }


}
