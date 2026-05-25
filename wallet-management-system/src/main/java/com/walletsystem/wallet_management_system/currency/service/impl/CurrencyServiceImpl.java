package com.walletsystem.wallet_management_system.currency.service.impl;

import com.walletsystem.wallet_management_system.currency.dto.CurrencyRequest;
import com.walletsystem.wallet_management_system.currency.dto.CurrencyResponse;
import com.walletsystem.wallet_management_system.currency.entity.Currency;
import com.walletsystem.wallet_management_system.currency.repository.CurrencyRepository;
import com.walletsystem.wallet_management_system.currency.service.CurrencyService;
import com.walletsystem.wallet_management_system.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CurrencyServiceImpl implements CurrencyService {

    private final CurrencyRepository currencyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CurrencyResponse> getAllCurrencies() {
        return currencyRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CurrencyResponse getCurrencyById(Long id) {
        Currency currency = currencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Currency not found with id: " + id));
        return toResponse(currency);
    }

    @Override
    public CurrencyResponse createCurrency(CurrencyRequest request) {
        Currency currency = new Currency();
        currency.setCurrencyCode(request.getCurrencyCode());
        currency.setCurrencyName(request.getCurrencyName());
        
        Currency savedCurrency = currencyRepository.save(currency);
        return toResponse(savedCurrency);
    }

    @Override
    public void deleteCurrency(Long id) {
        Currency currency = currencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Currency not found with id: " + id));
        
        currencyRepository.delete(currency);
    }

    private CurrencyResponse toResponse(Currency currency) {
        return new CurrencyResponse(
                currency.getId(),
                currency.getCurrencyCode(),
                currency.getCurrencyName()
        );
    }
}
