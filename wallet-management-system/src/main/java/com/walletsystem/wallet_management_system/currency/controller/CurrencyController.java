package com.walletsystem.wallet_management_system.currency.controller;

import com.walletsystem.wallet_management_system.currency.dto.CurrencyRequest;
import com.walletsystem.wallet_management_system.currency.dto.CurrencyResponse;
import com.walletsystem.wallet_management_system.currency.service.CurrencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/currencies")
@RequiredArgsConstructor
public class CurrencyController {

    private final CurrencyService currencyService;

    @GetMapping
    public ResponseEntity<List<CurrencyResponse>> getAllCurrencies() {
        return ResponseEntity.ok(currencyService.getAllCurrencies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CurrencyResponse> getCurrencyById(@PathVariable Long id) {
        return ResponseEntity.ok(currencyService.getCurrencyById(id));
    }

    @PostMapping
    public ResponseEntity<CurrencyResponse> createCurrency(@Valid @RequestBody CurrencyRequest request) {
        return ResponseEntity.ok(currencyService.createCurrency(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurrency(@PathVariable Long id) {
        currencyService.deleteCurrency(id);
        return ResponseEntity.noContent().build();
    }
}
