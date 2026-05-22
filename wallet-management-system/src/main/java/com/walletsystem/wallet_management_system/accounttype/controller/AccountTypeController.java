package com.walletsystem.wallet_management_system.accounttype.controller;

import com.walletsystem.wallet_management_system.accounttype.dto.AccountTypeRequest;
import com.walletsystem.wallet_management_system.accounttype.dto.AccountTypeResponse;
import com.walletsystem.wallet_management_system.accounttype.service.AccountTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account-types")
@RequiredArgsConstructor
public class AccountTypeController {

    private final AccountTypeService accountTypeService;

    @GetMapping
    public ResponseEntity<List<AccountTypeResponse>> getAllAccountTypes() {
        return ResponseEntity.ok(accountTypeService.getAllAccountTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountTypeResponse> getAccountTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(accountTypeService.getAccountTypeById(id));
    }

    @PostMapping
    public ResponseEntity<AccountTypeResponse> createAccountType(@Valid @RequestBody AccountTypeRequest request) {
        return ResponseEntity.ok(accountTypeService.createAccountType(request));
    }
}
