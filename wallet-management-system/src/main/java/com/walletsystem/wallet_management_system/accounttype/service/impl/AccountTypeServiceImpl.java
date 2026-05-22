package com.walletsystem.wallet_management_system.accounttype.service.impl;

import com.walletsystem.wallet_management_system.accounttype.dto.AccountTypeRequest;
import com.walletsystem.wallet_management_system.accounttype.dto.AccountTypeResponse;
import com.walletsystem.wallet_management_system.accounttype.entity.AccountType;
import com.walletsystem.wallet_management_system.accounttype.repository.AccountTypeRepository;
import com.walletsystem.wallet_management_system.accounttype.service.AccountTypeService;
import com.walletsystem.wallet_management_system.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountTypeServiceImpl implements AccountTypeService {

    private final AccountTypeRepository accountTypeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AccountTypeResponse> getAllAccountTypes() {
        return accountTypeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AccountTypeResponse getAccountTypeById(Long id) {
        AccountType accountType = accountTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account type not found with id: " + id));
        return toResponse(accountType);
    }

    @Override
    public AccountTypeResponse createAccountType(AccountTypeRequest request) {
        AccountType accountType = new AccountType();
        accountType.setTypeName(request.getTypeName());
        
        AccountType savedAccountType = accountTypeRepository.save(accountType);
        return toResponse(savedAccountType);
    }

    private AccountTypeResponse toResponse(AccountType accountType) {
        return new AccountTypeResponse(
                accountType.getId(),
                accountType.getTypeName()
        );
    }
}
