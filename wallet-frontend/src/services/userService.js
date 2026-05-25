import api from './api';

/**
 * User Service
 * Handles all user CRUD operations
 */

// Get all users
export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

// Create new user
export const createUser = async (userData) => {
  const response = await api.post('/api/users', userData);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
