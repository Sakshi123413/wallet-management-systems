package com.walletsystem.wallet_management_system.account.service;

import com.walletsystem.wallet_management_system.account.dto.AccountRequest;
import com.walletsystem.wallet_management_system.account.dto.AccountResponse;

import java.util.List;

public interface AccountService {
    List<AccountResponse> getAllAccounts();
    List<AccountResponse> getAccountsByUserId(Long userId);
    AccountResponse getAccountById(Long id);
    AccountResponse createAccount(AccountRequest request);
    AccountResponse updateAccount(Long id, AccountRequest request);
    void deleteAccount(Long id);
}
