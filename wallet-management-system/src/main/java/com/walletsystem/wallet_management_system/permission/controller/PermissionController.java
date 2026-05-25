package com.walletsystem.wallet_management_system.permission.controller;

import com.walletsystem.wallet_management_system.permission.dto.PermissionRequest;
import com.walletsystem.wallet_management_system.permission.dto.PermissionResponse;
import com.walletsystem.wallet_management_system.permission.service.PermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public ResponseEntity<List<PermissionResponse>> getAllPermissions() {
        log.info("REST API call: GET /api/permissions - Retrieving all permissions");
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermissionResponse> getPermissionById(@PathVariable Long id) {
        log.info("REST API call: GET /api/permissions/{} - Retrieving permission by ID", id);
        return ResponseEntity.ok(permissionService.getPermissionById(id));
    }

    @PostMapping
    public ResponseEntity<PermissionResponse> createPermission(@Valid @RequestBody PermissionRequest request) {
        log.info("REST API call: POST /api/permissions - Creating new permission with name: {}", request.getName());
        return ResponseEntity.ok(permissionService.createPermission(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        log.info("REST API call: DELETE /api/permissions/{} - Deleting permission", id);
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }
}
