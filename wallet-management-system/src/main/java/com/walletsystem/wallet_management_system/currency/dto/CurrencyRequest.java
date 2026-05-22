package com.walletsystem.wallet_management_system.currency.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrencyRequest {

    @NotBlank(message = "Currency code is required")
    @Size(max = 10, message = "Currency code must be at most 10 characters")
    private String currencyCode;

    @NotBlank(message = "Currency name is required")
    @Size(max = 50, message = "Currency name must be at most 50 characters")
    private String currencyName;
}
