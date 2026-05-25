package com.walletsystem.wallet_management_system.permission.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermissionResponse {
    @NonNull
    private Long id;
    private String name;
}
