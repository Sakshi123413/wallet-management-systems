package com.walletsystem.wallet_management_system.group.controller;

import com.walletsystem.wallet_management_system.group.dto.GroupRequest;
import com.walletsystem.wallet_management_system.group.dto.GroupResponse;
import com.walletsystem.wallet_management_system.group.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getAllGroups() {
        log.info("REST API call: GET /api/groups - Retrieving all groups");
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponse> getGroupById(@PathVariable Long id) {
        log.info("REST API call: GET /api/groups/{} - Retrieving group by ID", id);
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@Valid @RequestBody GroupRequest request) {
        log.info("REST API call: POST /api/groups - Creating new group with name: {}", request.getName());
        return ResponseEntity.ok(groupService.createGroup(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponse> updateGroup(@PathVariable Long id, @Valid @RequestBody GroupRequest request) {
        log.info("REST API call: PUT /api/groups/{} - Updating group", id);
        return ResponseEntity.ok(groupService.updateGroup(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        log.info("REST API call: DELETE /api/groups/{} - Deleting group", id);
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}
