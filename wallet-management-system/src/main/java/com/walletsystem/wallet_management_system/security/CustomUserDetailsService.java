package com.walletsystem.wallet_management_system.security;

import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.user.entity.User;
import com.walletsystem.wallet_management_system.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<SimpleGrantedAuthority> authorities = getUserAuthorities(user);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }

    private List<SimpleGrantedAuthority> getUserAuthorities(User user) {
        if (user.getGroup() == null) {
            return List.of(new SimpleGrantedAuthority("USER"));
        }

        // Get permissions from the group's ManyToMany relationship
        Set<Permission> permissions = user.getGroup().getPermissions();
        if (permissions == null || permissions.isEmpty()) {
            return List.of(new SimpleGrantedAuthority("USER"));
        }

        return permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                .collect(Collectors.toList());
    }
}
