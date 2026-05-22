package com.walletsystem.wallet_management_system.config;

import com.walletsystem.wallet_management_system.accounttype.entity.AccountType;
import com.walletsystem.wallet_management_system.accounttype.repository.AccountTypeRepository;
import com.walletsystem.wallet_management_system.currency.entity.Currency;
import com.walletsystem.wallet_management_system.currency.repository.CurrencyRepository;
import com.walletsystem.wallet_management_system.group.entity.Group;
import com.walletsystem.wallet_management_system.group.entity.GroupPermission;
import com.walletsystem.wallet_management_system.group.entity.GroupPermissionId;
import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.group.repository.GroupPermissionRepository;
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
    private final GroupPermissionRepository groupPermissionRepository;

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
            permissionRepository.save(new Permission(null, "READ"));
            permissionRepository.save(new Permission(null, "WRITE"));
            permissionRepository.save(new Permission(null, "DELETE"));
            permissionRepository.save(new Permission(null, "ADMIN"));
        }
    }

    private void initializeGroups() {
        if (groupRepository.count() == 0) {
            Group adminGroup = groupRepository.save(new Group(null, "ADMIN", new HashSet<>()));
            Group userGroup = groupRepository.save(new Group(null, "USER", new HashSet<>()));

            List<Permission> permissionList = permissionRepository.findAll();
            Set<Permission> allPermissions = new HashSet<>(permissionList);
            Permission readPermission = permissionList.stream()
                    .filter(p -> p.getName().equals("READ"))
                    .findFirst()
                    .orElse(null);

            if (readPermission != null) {
                assignPermissionToGroup(userGroup, readPermission);
            }

            for (Permission permission : allPermissions) {
                assignPermissionToGroup(adminGroup, permission);
            }
        }
    }

    private void assignPermissionToGroup(Group group, Permission permission) {
        GroupPermissionId id = new GroupPermissionId(group.getId(), permission.getId());
        GroupPermission groupPermission = new GroupPermission();
        groupPermission.setId(id);
        groupPermission.setGroup(group);
        groupPermission.setPermission(permission);
        groupPermissionRepository.save(groupPermission);
    }
}
