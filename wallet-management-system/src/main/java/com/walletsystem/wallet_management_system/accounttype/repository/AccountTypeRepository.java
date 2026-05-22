package com.walletsystem.wallet_management_system.accounttype.repository;

import com.walletsystem.wallet_management_system.accounttype.entity.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountTypeRepository extends JpaRepository<AccountType, Long> {
}
