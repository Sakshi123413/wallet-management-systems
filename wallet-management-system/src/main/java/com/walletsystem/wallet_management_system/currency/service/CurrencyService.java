package com.walletsystem.wallet_management_system.currency.service;

import com.walletsystem.wallet_management_system.currency.dto.CurrencyRequest;
import com.walletsystem.wallet_management_system.currency.dto.CurrencyResponse;

import java.util.List;

public interface CurrencyService {
    List<CurrencyResponse> getAllCurrencies();
    CurrencyResponse getCurrencyById(Long id);
    CurrencyResponse createCurrency(CurrencyRequest request);
    void deleteCurrency(Long id);
}
