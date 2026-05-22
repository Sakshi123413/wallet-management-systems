package com.walletsystem.wallet_management_system.accounttype.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountTypeResponse {
    private Long id;
    private String typeName;
}
