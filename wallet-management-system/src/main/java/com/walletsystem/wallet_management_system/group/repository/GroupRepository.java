package com.walletsystem.wallet_management_system.group.repository;

import com.walletsystem.wallet_management_system.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    
    /**
     * Check if a group with the given name exists
     */
    boolean existsByName(String name);
}
