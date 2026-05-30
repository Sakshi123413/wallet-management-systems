import { useState, useCallback } from 'react';
import { 
  login as apiLogin, 
  signup as apiSignup, 
  logout as apiLogout,
  storeAuthData, 
  clearAuthData, 
  getUser, 
  getToken, 
  isAuthenticated 
} from '../services/authService';
import { showSuccess, showError } from '../components/common/Toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);

      // Call real backend API
      const response = await apiLogin(email, password);
      
      // Store token and user data in localStorage
      storeAuthData(response.token, {
        userId: response.userId,
        email: response.email,
        name: response.name,
      });

      showSuccess(`Welcome back, ${response.name}!`);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please check your credentials.';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      setLoading(true);

      // Call real backend API
      const response = await apiSignup(userData);
      
      // Store token and user data in localStorage (auto-login)
      storeAuthData(response.token, {
        userId: response.userId,
        email: response.email,
        name: response.name,
        groupName: response.groupName,
      });

      showSuccess(`Welcome, ${response.name}! Your account has been created successfully.`);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Signup failed. Please try again.';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLogoutLoading(true);
      
      // Call backend logout API
      await apiLogout();
      
      // Clear all auth data
      clearAuthData();
      
      showSuccess('Logout successful');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local data for security
      clearAuthData();
      
      showError('Logout failed, but local data cleared');
      
      return { success: false, error: error?.message || 'Logout failed' };
    } finally {
      setLogoutLoading(false);
    }
  }, []);

  const getUserData = useCallback(() => {
    return getUser();
  }, []);

  const getTokenData = useCallback(() => {
    return getToken();
  }, []);

  const checkIsAuthenticated = useCallback(() => {
    return isAuthenticated();
  }, []);

  return {
    login,
    signup,
    logout,
    getUser: getUserData,
    getToken: getTokenData,
    isAuthenticated: checkIsAuthenticated,
    loading,
    logoutLoading,
  };
};
