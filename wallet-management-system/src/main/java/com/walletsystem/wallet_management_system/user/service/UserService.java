package com.walletsystem.wallet_management_system.user.service;

import com.walletsystem.wallet_management_system.user.dto.UserRequest;
import com.walletsystem.wallet_management_system.user.dto.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}
