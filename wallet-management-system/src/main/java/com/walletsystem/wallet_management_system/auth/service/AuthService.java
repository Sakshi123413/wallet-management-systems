package com.walletsystem.wallet_management_system.auth.service;

import com.walletsystem.wallet_management_system.auth.dto.LoginRequest;
import com.walletsystem.wallet_management_system.auth.dto.LoginResponse;
import com.walletsystem.wallet_management_system.auth.dto.SignupRequest;

public interface AuthService {
    LoginResponse signup(SignupRequest request);
    LoginResponse login(LoginRequest request);
    void logout(String token);
}
