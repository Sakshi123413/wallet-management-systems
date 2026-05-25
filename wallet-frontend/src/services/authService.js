import api from './api';

/**
 * Authentication Service
 * Handles login, signup, logout, and token management
 */

// Login user
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

// Signup user
export const signup = async (userData) => {
  const response = await api.post('/api/auth/signup', userData);
  return response.data;
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } finally {
    // Always clear local storage even if API call fails
    clearAuthData();
  }
};

// Store authentication data
export const storeAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Get authentication token
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Get user data
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Update user data in localStorage
export const updateUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export default {
  login,
  signup,
  logout,
  storeAuthData,
  getToken,
  getUser,
  isAuthenticated,
  clearAuthData,
  updateUserData,
};
