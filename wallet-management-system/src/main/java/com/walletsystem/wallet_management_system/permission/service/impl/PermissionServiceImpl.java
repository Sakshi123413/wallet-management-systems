package com.walletsystem.wallet_management_system.permission.service.impl;

import com.walletsystem.wallet_management_system.exception.ResourceNotFoundException;
import com.walletsystem.wallet_management_system.permission.dto.PermissionRequest;
import com.walletsystem.wallet_management_system.permission.dto.PermissionResponse;
import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.permission.repository.PermissionRepository;
import com.walletsystem.wallet_management_system.permission.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        log.info("SERVICE: Starting getAllPermissions - Fetching all permissions from database");
        List<PermissionResponse> permissions = permissionRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        log.info("SERVICE: getAllPermissions completed - Retrieved {} permissions", permissions.size());
        return permissions;
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionResponse getPermissionById(Long id) {
        log.info("SERVICE: Starting getPermissionById - Looking up permission with ID: {}", id);
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        log.info("SERVICE: getPermissionById completed - Found permission: {}", permission.getName());
        return toResponse(permission);
    }

    @Override
    public PermissionResponse createPermission(PermissionRequest request) {
        log.info("SERVICE: Starting createPermission - Creating new permission with name: {}", request.getName());
        
        Permission permission = new Permission();
        permission.setName(request.getName());
        
        Permission savedPermission = permissionRepository.save(permission);
        log.info("SERVICE: createPermission completed - Successfully created permission with ID: {}", savedPermission.getId());
        return toResponse(savedPermission);
    }

    @Override
    public void deletePermission(Long id) {
        log.info("SERVICE: Starting deletePermission - Deleting permission with ID: {}", id);
        
        if (!permissionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Permission not found with id: " + id);
        }
        permissionRepository.deleteById(id);
        log.info("SERVICE: deletePermission completed - Successfully deleted permission with ID: {}", id);
    }

    private PermissionResponse toResponse(Permission permission) {
        return new PermissionResponse(
                permission.getId(),
                permission.getName()
        );
    }
}
