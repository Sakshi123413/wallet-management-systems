package com.walletsystem.wallet_management_system.account.service.impl;

import com.walletsystem.wallet_management_system.account.dto.AccountRequest;
import com.walletsystem.wallet_management_system.account.dto.AccountResponse;
import com.walletsystem.wallet_management_system.account.entity.Account;
import com.walletsystem.wallet_management_system.account.repository.AccountRepository;
import com.walletsystem.wallet_management_system.account.service.AccountService;
import com.walletsystem.wallet_management_system.accounttype.entity.AccountType;
import com.walletsystem.wallet_management_system.accounttype.repository.AccountTypeRepository;
import com.walletsystem.wallet_management_system.currency.entity.Currency;
import com.walletsystem.wallet_management_system.currency.repository.CurrencyRepository;
import com.walletsystem.wallet_management_system.exception.ResourceNotFoundException;
import com.walletsystem.wallet_management_system.user.entity.User;
import com.walletsystem.wallet_management_system.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final CurrencyRepository currencyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return toResponse(account);
    }

    @Override
    public AccountResponse createAccount(AccountRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        AccountType accountType = accountTypeRepository.findById(request.getAccountTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Account type not found with id: " + request.getAccountTypeId()));
        
        Currency currency = currencyRepository.findById(request.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("Currency not found with id: " + request.getCurrencyId()));
        
        Account account = new Account();
        account.setUser(user);
        account.setAccountType(accountType);
        account.setCurrency(currency);
        account.setBalance(request.getBalance());
        
        Account savedAccount = accountRepository.save(account);
        return toResponse(savedAccount);
    }

    @Override
    public AccountResponse updateAccount(Long id, AccountRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        AccountType accountType = accountTypeRepository.findById(request.getAccountTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Account type not found with id: " + request.getAccountTypeId()));
        
        Currency currency = currencyRepository.findById(request.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("Currency not found with id: " + request.getCurrencyId()));
        
        account.setUser(user);
        account.setAccountType(accountType);
        account.setCurrency(currency);
        account.setBalance(request.getBalance());
        
        Account updatedAccount = accountRepository.save(account);
        return toResponse(updatedAccount);
    }

    @Override
    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }

    private AccountResponse toResponse(Account account) {
        return new AccountResponse(
                account.getId() != null ? account.getId() : 0L,
                account.getUser().getId(),
                account.getAccountType().getTypeName(),
                account.getCurrency().getCurrencyCode(),
                account.getBalance()
        );
    }
}
