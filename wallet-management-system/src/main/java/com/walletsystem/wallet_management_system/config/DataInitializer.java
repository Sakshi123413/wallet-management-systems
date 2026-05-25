package com.walletsystem.wallet_management_system.config;

import com.walletsystem.wallet_management_system.accounttype.entity.AccountType;
import com.walletsystem.wallet_management_system.accounttype.repository.AccountTypeRepository;
import com.walletsystem.wallet_management_system.currency.entity.Currency;
import com.walletsystem.wallet_management_system.currency.repository.CurrencyRepository;
import com.walletsystem.wallet_management_system.group.entity.Group;
import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.group.repository.GroupRepository;
import com.walletsystem.wallet_management_system.permission.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CurrencyRepository currencyRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final PermissionRepository permissionRepository;
    private final GroupRepository groupRepository;

    @Override
    public void run(String... args) {
        initializeCurrencies();
        initializeAccountTypes();
        initializePermissions();
        initializeGroups();
    }

    private void initializeCurrencies() {
        if (currencyRepository.count() == 0) {
            currencyRepository.save(new Currency(null, "INR", "Indian Rupee"));
            currencyRepository.save(new Currency(null, "USD", "United States Dollar"));
            currencyRepository.save(new Currency(null, "EUR", "Euro"));
            currencyRepository.save(new Currency(null, "GBP", "British Pound Sterling"));
        }
    }

    private void initializeAccountTypes() {
        if (accountTypeRepository.count() == 0) {
            accountTypeRepository.save(new AccountType(null, "savings"));
            accountTypeRepository.save(new AccountType(null, "business"));
            accountTypeRepository.save(new AccountType(null, "current"));
            accountTypeRepository.save(new AccountType(null, "wallet"));
        }
    }

    private void initializePermissions() {
        if (permissionRepository.count() == 0) {
            Permission read = new Permission();
            read.setName("READ");
            permissionRepository.save(read);
            
            Permission write = new Permission();
            write.setName("WRITE");
            permissionRepository.save(write);
            
            Permission delete = new Permission();
            delete.setName("DELETE");
            permissionRepository.save(delete);
            
            Permission admin = new Permission();
            admin.setName("ADMIN");
            permissionRepository.save(admin);
        }
    }

    private void initializeGroups() {
        if (groupRepository.count() == 0) {
            List<Permission> allPermissions = permissionRepository.findAll();
            
            // Create ADMIN group with all permissions
            Group adminGroup = new Group();
            adminGroup.setName("ADMIN");
            adminGroup.setPermissions(new HashSet<>(allPermissions));
            groupRepository.save(adminGroup);
            
            // Create USER group with only READ permission
            Group userGroup = new Group();
            userGroup.setName("USER");
            Permission readPermission = allPermissions.stream()
                    .filter(p -> p.getName().equals("READ"))
                    .findFirst()
                    .orElse(null);
            
            if (readPermission != null) {
                Set<Permission> userPermissions = new HashSet<>();
                userPermissions.add(readPermission);
                userGroup.setPermissions(userPermissions);
            }
            
            groupRepository.save(userGroup);
        }
    }
}
