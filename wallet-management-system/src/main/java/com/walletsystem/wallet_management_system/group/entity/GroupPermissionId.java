package com.walletsystem.wallet_management_system.group.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupPermissionId implements Serializable {

    private Long groupId;
    private Long permissionId;
}
