package com.walletsystem.wallet_management_system.permission.repository;

import com.walletsystem.wallet_management_system.permission.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
