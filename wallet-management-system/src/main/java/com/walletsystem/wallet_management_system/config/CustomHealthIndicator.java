package com.walletsystem.wallet_management_system.config;

import com.walletsystem.wallet_management_system.group.repository.GroupRepository;
import com.walletsystem.wallet_management_system.permission.repository.PermissionRepository;
import com.walletsystem.wallet_management_system.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomHealthIndicator implements HealthIndicator {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public Health health() {
        try {
            long userCount = userRepository.count();
            long groupCount = groupRepository.count();
            long permissionCount = permissionRepository.count();
            
            return Health.up()
                    .withDetail("users", userCount)
                    .withDetail("groups", groupCount)
                    .withDetail("permissions", permissionCount)
                    .withDetail("database", "PostgreSQL")
                    .build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
