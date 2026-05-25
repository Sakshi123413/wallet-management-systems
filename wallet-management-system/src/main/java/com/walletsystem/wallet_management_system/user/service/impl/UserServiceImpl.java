package com.walletsystem.wallet_management_system.user.service.impl;

import com.walletsystem.wallet_management_system.exception.ResourceNotFoundException;
import com.walletsystem.wallet_management_system.group.entity.Group;
import com.walletsystem.wallet_management_system.group.repository.GroupRepository;
import com.walletsystem.wallet_management_system.user.dto.UserRequest;
import com.walletsystem.wallet_management_system.user.dto.UserResponse;
import com.walletsystem.wallet_management_system.user.entity.User;
import com.walletsystem.wallet_management_system.user.repository.UserRepository;
import com.walletsystem.wallet_management_system.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        log.info("SERVICE: Starting getAllUsers - Fetching all users from database");
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        log.info("SERVICE: getAllUsers completed - Retrieved {} users", users.size());
        return users;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        log.info("SERVICE: Starting getUserById - Looking up user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        log.info("SERVICE: getUserById completed - Found user: {}", user.getName());
        return toResponse(user);
    }

    @Override
    public UserResponse createUser(UserRequest request) {
        log.info("SERVICE: Starting createUser - Creating new user with email: {}", request.getEmail());
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        if (request.getGroupId() != null) {
            log.info("SERVICE: Assigning user to group ID: {}", request.getGroupId());
            Group group = groupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + request.getGroupId()));
            user.setGroup(group);
        }
        
        User savedUser = userRepository.save(user);
        log.info("SERVICE: createUser completed - Successfully created user with ID: {}", savedUser.getId());
        return toResponse(savedUser);
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        log.info("SERVICE: Starting updateUser - Updating user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        log.info("SERVICE: Updated user name and email");
        
        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            log.info("SERVICE: Updating user password");
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        if (request.getGroupId() != null) {
            log.info("SERVICE: Updating user group to ID: {}", request.getGroupId());
            Group group = groupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + request.getGroupId()));
            user.setGroup(group);
        }
        
        User updatedUser = userRepository.save(user);
        log.info("SERVICE: updateUser completed - Successfully updated user with ID: {}", updatedUser.getId());
        return toResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        log.info("SERVICE: Starting deleteUser - Deleting user with ID: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        log.info("SERVICE: deleteUser completed - Successfully deleted user with ID: {}", id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getGroup() != null ? user.getGroup().getName() : null
        );
    }
}
