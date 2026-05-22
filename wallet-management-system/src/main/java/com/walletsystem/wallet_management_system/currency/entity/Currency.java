package com.walletsystem.wallet_management_system.currency.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "currencies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Currency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "currency_code", nullable = false, unique = true, length = 10)
    @NotBlank(message = "Currency code is required")
    @Size(max = 10, message = "Currency code must be at most 10 characters")
    private String currencyCode;

    @Column(name = "currency_name", nullable = false, length = 50)
    @NotBlank(message = "Currency name is required")
    @Size(max = 50, message = "Currency name must be at most 50 characters")
    private String currencyName;
}
