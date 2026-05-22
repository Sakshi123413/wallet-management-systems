package com.walletsystem.wallet_management_system.group.repository;

import com.walletsystem.wallet_management_system.group.entity.GroupPermission;
import com.walletsystem.wallet_management_system.group.entity.GroupPermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupPermissionRepository extends JpaRepository<GroupPermission, GroupPermissionId> {
    List<GroupPermission> findByGroupId(Long groupId);
}
