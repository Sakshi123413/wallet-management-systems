import api from './api';

/**
 * Account Type Service
 * Handles all account type operations
 */

// Get all account types
export const getAccountTypes = async () => {
  const response = await api.get('/api/account-types');
  return response.data;
};

// Get account type by ID
export const getAccountTypeById = async (id) => {
  const response = await api.get(`/api/account-types/${id}`);
  return response.data;
};

// Create new account type
export const createAccountType = async (accountTypeData) => {
  const response = await api.post('/api/account-types', accountTypeData);
  return response.data;
};

export default {
  getAccountTypes,
  getAccountTypeById,
  createAccountType,
};
