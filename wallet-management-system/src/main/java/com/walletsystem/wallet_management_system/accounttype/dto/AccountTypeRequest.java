package com.walletsystem.wallet_management_system.accounttype.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountTypeRequest {

    @NotBlank(message = "Account type name is required")
    private String typeName;
}
