package com.walletsystem.wallet_management_system.group.repository;

import com.walletsystem.wallet_management_system.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    
    @Query("SELECT DISTINCT g FROM Group g LEFT JOIN FETCH g.groupPermissions gp LEFT JOIN FETCH gp.permission")
    List<Group> findAllWithPermissions();
}
