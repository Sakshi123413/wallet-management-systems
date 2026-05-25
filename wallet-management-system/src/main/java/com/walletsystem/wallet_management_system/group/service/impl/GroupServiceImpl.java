package com.walletsystem.wallet_management_system.group.service.impl;

import com.walletsystem.wallet_management_system.exception.ResourceNotFoundException;
import com.walletsystem.wallet_management_system.group.dto.GroupRequest;
import com.walletsystem.wallet_management_system.group.dto.GroupResponse;
import com.walletsystem.wallet_management_system.group.entity.Group;
import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.group.repository.GroupRepository;
import com.walletsystem.wallet_management_system.group.service.GroupService;
import com.walletsystem.wallet_management_system.permission.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final PermissionRepository permissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GroupResponse> getAllGroups() {
        log.info("Fetching all groups");
        return groupRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupResponse getGroupById(Long id) {
        log.info("Fetching group by ID: {}", id);
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        return toResponse(group);
    }

    @Override
    @Transactional
    public GroupResponse createGroup(GroupRequest request) {
        log.info("Creating new group with name: {}", request.getName());
        
        // Check for duplicate group name
        if (groupRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Group with name '" + request.getName() + "' already exists");
        }
        
        Group group = new Group();
        group.setName(request.getName());
        
        // Assign permissions if provided
        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = loadPermissions(request.getPermissionIds());
            group.setPermissions(permissions);
        }
        
        Group savedGroup = groupRepository.save(group);
        log.info("Group created successfully with ID: {}", savedGroup.getId());
        
        return toResponse(savedGroup);
    }

    @Override
    @Transactional
    public GroupResponse updateGroup(Long id, GroupRequest request) {
        log.info("Updating group with ID: {}", id);
        
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        
        // Check for duplicate name (excluding current group)
        if (!group.getName().equals(request.getName()) && groupRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Group with name '" + request.getName() + "' already exists");
        }
        
        // Update group name
        group.setName(request.getName());
        
        // Update permissions if provided
        if (request.getPermissionIds() != null) {
            // Clear existing permissions
            group.getPermissions().clear();
            
            // Add new permissions
            if (!request.getPermissionIds().isEmpty()) {
                Set<Permission> permissions = loadPermissions(request.getPermissionIds());
                group.setPermissions(permissions);
            }
        }
        
        Group updatedGroup = groupRepository.save(group);
        log.info("Group updated successfully with ID: {}", updatedGroup.getId());
        
        return toResponse(updatedGroup);
    }

    @Override
    @Transactional
    public void deleteGroup(Long id) {
        log.info("Deleting group with ID: {}", id);
        
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        
        // Check if group has users
        if (!group.getUsers().isEmpty()) {
            throw new IllegalArgumentException("Cannot delete group '" + group.getName() + "' because it has " + group.getUsers().size() + " user(s) assigned");
        }
        
        // Clear permissions before deletion (ManyToMany cleanup)
        group.getPermissions().clear();
        groupRepository.save(group);
        
        // Delete the group
        groupRepository.delete(group);
        log.info("Group deleted successfully with ID: {}", id);
    }

    /**
     * Load permissions by IDs
     */
    private Set<Permission> loadPermissions(Set<Long> permissionIds) {
        Set<Permission> permissions = new HashSet<>();
        
        for (Long permissionId : permissionIds) {
            if (permissionId == null) {
                log.warn("Skipping null permission ID");
                continue;
            }
            
            Permission permission = permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
            
            permissions.add(permission);
        }
        
        log.info("Loaded {} permissions", permissions.size());
        return permissions;
    }

    /**
     * Convert Group entity to GroupResponse DTO
     */
    private GroupResponse toResponse(Group group) {
        Set<String> permissionNames = new HashSet<>();
        
        if (group.getPermissions() != null) {
            permissionNames = group.getPermissions().stream()
                    .map(Permission::getName)
                    .collect(Collectors.toSet());
        }
        
        return new GroupResponse(
                group.getId(),
                group.getName(),
                permissionNames
        );
    }
}
