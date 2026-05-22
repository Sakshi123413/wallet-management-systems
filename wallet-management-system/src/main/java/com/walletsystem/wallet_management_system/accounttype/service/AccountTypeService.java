package com.walletsystem.wallet_management_system.accounttype.service;

import com.walletsystem.wallet_management_system.accounttype.dto.AccountTypeRequest;
import com.walletsystem.wallet_management_system.accounttype.dto.AccountTypeResponse;

import java.util.List;

public interface AccountTypeService {
    List<AccountTypeResponse> getAllAccountTypes();
    AccountTypeResponse getAccountTypeById(Long id);
    AccountTypeResponse createAccountType(AccountTypeRequest request);
}
