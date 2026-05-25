import axios from 'axios';
import { showSuccess, showError } from '../components/common/Toast';

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request Interceptor - Attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          // Prevent redirect loop: only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            showError('Session expired. Please login again.');
            window.location.href = '/login';
          }
          break;
        
        case 403:
          // Forbidden
          showError('You do not have permission to perform this action.');
          break;
        
        case 404:
          // Not Found
          console.warn('Resource not found:', error.config?.url);
          // Don't show toast for 404, just log it
          break;
        
        case 409:
          // Conflict
          showError(data?.message || 'Conflict occurred. Please try again.');
          break;
        
        case 500:
          // Internal Server Error
          showError('Internal server error. Please try again later.');
          break;
        
        default:
          showError(data?.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      // Network error - backend not reachable
      console.error('Network error - Backend may not be running:', error.config?.baseURL);
      showError('Cannot connect to backend. Please ensure the server is running.');
    } else {
      // Other errors
      showError(error.message || 'An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API calls
export const loginUser = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await api.post('/api/auth/signup', userData);
  return response.data;
};

// User API calls
export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/api/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

// Account Type API calls
export const getAccountTypes = async () => {
  const response = await api.get('/api/account-types');
  return response.data;
};

export const getAccountTypeById = async (id) => {
  const response = await api.get(`/api/account-types/${id}`);
  return response.data;
};

export const createAccountType = async (accountTypeData) => {
  const response = await api.post('/api/account-types', accountTypeData);
  return response.data;
};

// Currency API calls
export const getCurrencies = async () => {
  const response = await api.get('/api/currencies');
  return response.data;
};

export const getCurrencyById = async (id) => {
  const response = await api.get(`/api/currencies/${id}`);
  return response.data;
};

export const createCurrency = async (currencyData) => {
  const response = await api.post('/api/currencies', currencyData);
  return response.data;
};

// Group API calls
export const getGroups = async () => {
  const response = await api.get('/api/groups');
  return response.data;
};

export const getGroupById = async (id) => {
  const response = await api.get(`/api/groups/${id}`);
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await api.post('/api/groups', groupData);
  return response.data;
};

export const updateGroup = async (id, groupData) => {
  const response = await api.put(`/api/groups/${id}`, groupData);
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await api.delete(`/api/groups/${id}`);
  return response.data;
};

// Permission API calls
export const getPermissions = async () => {
  const response = await api.get('/api/permissions');
  return response.data;
};

export const getPermissionById = async (id) => {
  const response = await api.get(`/api/permissions/${id}`);
  return response.data;
};

export const createPermission = async (permissionData) => {
  const response = await api.post('/api/permissions', permissionData);
  return response.data;
};

export const deletePermission = async (id) => {
  const response = await api.delete(`/api/permissions/${id}`);
  return response.data;
};

// Account API calls
export const getAccounts = async () => {
  const response = await api.get('/api/accounts');
  return response.data;
};

export const getAccountsByUserId = async (userId) => {
  const response = await api.get(`/api/accounts/user/${userId}`);
  return response.data;
};

export const getAccountById = async (id) => {
  const response = await api.get(`/api/accounts/${id}`);
  return response.data;
};

export const createAccount = async (accountData) => {
  const response = await api.post('/api/accounts', accountData);
  return response.data;
};

export const updateAccount = async (id, accountData) => {
  const response = await api.put(`/api/accounts/${id}`, accountData);
  return response.data;
};

export const deleteAccount = async (id) => {
  const response = await api.delete(`/api/accounts/${id}`);
  return response.data;
};
