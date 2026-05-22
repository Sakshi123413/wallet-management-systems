package com.walletsystem.wallet_management_system.currency.repository;

import com.walletsystem.wallet_management_system.currency.entity.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {
}
