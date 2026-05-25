package com.walletsystem.wallet_management_system.accounttype.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountTypeResponse {
    @NonNull
    private Long id;
    private String typeName;
}
