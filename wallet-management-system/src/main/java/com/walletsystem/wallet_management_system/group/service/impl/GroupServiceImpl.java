package com.walletsystem.wallet_management_system.group.service.impl;
import com.walletsystem.wallet_management_system.exception.ResourceNotFoundException;
import com.walletsystem.wallet_management_system.group.dto.GroupRequest;
import com.walletsystem.wallet_management_system.group.dto.GroupResponse;
import com.walletsystem.wallet_management_system.group.entity.Group;
import com.walletsystem.wallet_management_system.group.entity.GroupPermission;
import com.walletsystem.wallet_management_system.group.entity.GroupPermissionId;
import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.group.repository.GroupPermissionRepository;
import com.walletsystem.wallet_management_system.group.repository.GroupRepository;
import com.walletsystem.wallet_management_system.group.service.GroupService;
import com.walletsystem.wallet_management_system.permission.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final PermissionRepository permissionRepository;
    private final GroupPermissionRepository groupPermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GroupResponse> getAllGroups() {
        return groupRepository.findAllWithPermissions().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupResponse getGroupById(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        return toResponse(group);
    }

    @Override
    public GroupResponse createGroup(GroupRequest request) {
        Group group = new Group();
        group.setName(request.getName());
        
        Group savedGroup = groupRepository.save(group);
        Long groupId = savedGroup.getId();
        
        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            assignPermissionsToGroup(savedGroup, request.getPermissionIds());
            // Reload the group to get the permissions in the response
            savedGroup = groupRepository.findById(groupId)
                    .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));
        }
        
        return toResponse(savedGroup);
    }

    @Override
    public GroupResponse updateGroup(Long id, GroupRequest request) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        
        group.setName(request.getName());
        
        if (request.getPermissionIds() != null) {
            groupPermissionRepository.deleteAll(group.getGroupPermissions());
            group.getGroupPermissions().clear();
            
            if (!request.getPermissionIds().isEmpty()) {
                assignPermissionsToGroup(group, request.getPermissionIds());
            }
            
            // Reload the group to get the updated permissions
            group = groupRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        }
        
        Group updatedGroup = groupRepository.save(group);
        return toResponse(updatedGroup);
    }

    @Override
    public void deleteGroup(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        
        // Delete all group permissions first (cascade should handle this, but being explicit)
        groupPermissionRepository.deleteAll(group.getGroupPermissions());
        
        // Delete the group
        groupRepository.deleteById(id);
    }

    private void assignPermissionsToGroup(Group group, Set<Long> permissionIds) {
        Set<GroupPermission> groupPermissions = new HashSet<>();
        for (Long permissionId : permissionIds) {
            Permission permission = permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
            
            GroupPermissionId groupPermissionId = new GroupPermissionId(group.getId(), permissionId);
            GroupPermission groupPermission = new GroupPermission();
            groupPermission.setId(groupPermissionId);
            groupPermission.setGroup(group);
            groupPermission.setPermission(permission);
            
            groupPermissions.add(groupPermission);
        }
        groupPermissionRepository.saveAll(groupPermissions);
    }

    private GroupResponse toResponse(Group group) {
        Set<String> permissions = new HashSet<>();
        if (group.getGroupPermissions() != null) {
            permissions = group.getGroupPermissions().stream()
                    .map(gp -> gp.getPermission() != null ? gp.getPermission().getName() : null)
                    .filter(name -> name != null)
                    .collect(Collectors.toSet());
        }
        
        return new GroupResponse(
                group.getId(),
                group.getName(),
                permissions
        );
    }
}
