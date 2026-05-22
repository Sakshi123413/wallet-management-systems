package com.walletsystem.wallet_management_system.group.entity;

import com.walletsystem.wallet_management_system.permission.entity.Permission;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "group_permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupPermission {

    @EmbeddedId
    private GroupPermissionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("groupId")
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("permissionId")
    @JoinColumn(name = "permission_id")
    private Permission permission;
}
