import api from './api';

/**
 * Permission Service
 * Handles all permission operations
 */

// Get all permissions
export const getPermissions = async () => {
  const response = await api.get('/api/permissions');
  return response.data;
};

// Get permission by ID
export const getPermissionById = async (id) => {
  const response = await api.get(`/api/permissions/${id}`);
  return response.data;
};

// Create new permission
export const createPermission = async (permissionData) => {
  const response = await api.post('/api/permissions', permissionData);
  return response.data;
};

// Delete permission
export const deletePermission = async (id) => {
  const response = await api.delete(`/api/permissions/${id}`);
  return response.data;
};

export default {
  getPermissions,
  getPermissionById,
  createPermission,
  deletePermission,
};
