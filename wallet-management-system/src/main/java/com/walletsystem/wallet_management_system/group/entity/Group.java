package com.walletsystem.wallet_management_system.group.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "Group name is required")
    @Size(max = 50, message = "Group name must be at most 50 characters")
    private String name;

    // Many-to-Many relationship with Permission
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "group_permissions",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore  // Prevent circular serialization
    private Set<Permission> permissions = new HashSet<>();

    // One-to-Many relationship with User
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore  // Prevent circular serialization
    private Set<User> users = new HashSet<>();
}