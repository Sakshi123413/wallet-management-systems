package com.walletsystem.wallet_management_system.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    @NonNull
    private Long id;
    private String name;
    private String email;
    private Long groupId;
    private String groupName;
}
