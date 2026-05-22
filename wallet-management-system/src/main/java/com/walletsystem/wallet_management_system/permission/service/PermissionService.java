package com.walletsystem.wallet_management_system.permission.service;

import com.walletsystem.wallet_management_system.permission.dto.PermissionRequest;
import com.walletsystem.wallet_management_system.permission.dto.PermissionResponse;

import java.util.List;

public interface PermissionService {
    List<PermissionResponse> getAllPermissions();
    PermissionResponse getPermissionById(Long id);
    PermissionResponse createPermission(PermissionRequest request);
    void deletePermission(Long id);
}
