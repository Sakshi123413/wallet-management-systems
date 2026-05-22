package com.walletsystem.wallet_management_system.currency.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrencyResponse {
    private Long id;
    private String currencyCode;
    private String currencyName;
}
