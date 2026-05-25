package com.walletsystem.wallet_management_system.group.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupRequest {

    @NotBlank(message = "Group name is required")
    @Size(max = 50, message = "Group name must be at most 50 characters")
    private String name;

    // Using Set to automatically prevent duplicate permission IDs
    private Set<Long> permissionIds;
}
