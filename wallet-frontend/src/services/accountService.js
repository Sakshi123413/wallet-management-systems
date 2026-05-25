import api from './api';

/**
 * Account Service
 * Handles all account CRUD operations
 */

// Get all accounts
export const getAccounts = async () => {
  const response = await api.get('/api/accounts');
  return response.data;
};

// Get accounts by user ID
export const getAccountsByUserId = async (userId) => {
  const response = await api.get(`/api/accounts/user/${userId}`);
  return response.data;
};

// Get account by ID
export const getAccountById = async (id) => {
  const response = await api.get(`/api/accounts/${id}`);
  return response.data;
};

// Create new account
export const createAccount = async (accountData) => {
  const response = await api.post('/api/accounts', accountData);
  return response.data;
};

// Update account
export const updateAccount = async (id, accountData) => {
  const response = await api.put(`/api/accounts/${id}`, accountData);
  return response.data;
};

// Delete account
export const deleteAccount = async (id) => {
  const response = await api.delete(`/api/accounts/${id}`);
  return response.data;
};

export default {
  getAccounts,
  getAccountsByUserId,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
