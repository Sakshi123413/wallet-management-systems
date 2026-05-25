package com.walletsystem.wallet_management_system.permission.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.walletsystem.wallet_management_system.group.entity.Group;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "Permission name is required")
    @Size(max = 50, message = "Permission name must be at most 50 characters")
    private String name;

    // Many-to-Many relationship with Group (bidirectional)
    @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore  // Prevent circular serialization
    private Set<Group> groups = new HashSet<>();
}
