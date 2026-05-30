package com.walletsystem.wallet_management_system.auth.service.impl;

import com.walletsystem.wallet_management_system.auth.dto.LoginRequest;
import com.walletsystem.wallet_management_system.auth.dto.LoginResponse;
import com.walletsystem.wallet_management_system.auth.dto.SignupRequest;
import com.walletsystem.wallet_management_system.auth.service.AuthService;
import com.walletsystem.wallet_management_system.exception.BusinessException;
import com.walletsystem.wallet_management_system.exception.InvalidCredentialsException;
import com.walletsystem.wallet_management_system.group.entity.Group;
import com.walletsystem.wallet_management_system.group.repository.GroupRepository;
import com.walletsystem.wallet_management_system.permission.entity.Permission;
import com.walletsystem.wallet_management_system.security.JwtUtil;
import com.walletsystem.wallet_management_system.user.entity.User;
import com.walletsystem.wallet_management_system.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse signup(SignupRequest request) {
        log.info("User signup attempt: email={}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Signup failed - email already exists: {}", request.getEmail());
            throw new BusinessException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getGroupId() != null) {
            Group group = groupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new BusinessException("Group not found with id: " + request.getGroupId()));
            user.setGroup(group);
        }

        userRepository.save(user);

        List<String> roles = getUserRoles(user);
        String token = jwtUtil.generateToken(user.getEmail(), roles);

        log.info("User signup successful: email={}, userId={}", request.getEmail(), user.getId());
        return new LoginResponse(token, user.getId(), user.getEmail(), user.getName(), 
                user.getGroup() != null ? user.getGroup().getName() : "USER");
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("User login attempt: email={}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed - invalid password for email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        List<String> roles = getUserRoles(user);
        String token = jwtUtil.generateToken(user.getEmail(), roles);
        
        String groupName = user.getGroup() != null ? user.getGroup().getName() : "USER";
        log.info("User login successful: email={}, userId={}, groupName={}", request.getEmail(), user.getId(), groupName);
        
        return new LoginResponse(token, user.getId(), user.getEmail(), user.getName(), groupName);
    }

    @Override
    public void logout(String token) {
        // For JWT stateless authentication, logout is handled client-side by deleting the token
        // Server-side token blacklisting can be implemented if needed
    }

    private List<String> getUserRoles(User user) {
        if (user.getGroup() == null) {
            return List.of("USER");
        }

        // Get permissions from the group's ManyToMany relationship
        Set<Permission> permissions = user.getGroup().getPermissions();
        if (permissions == null || permissions.isEmpty()) {
            return List.of("USER");
        }

        return permissions.stream()
                .map(Permission::getName)
                .collect(Collectors.toList());
    }
}
