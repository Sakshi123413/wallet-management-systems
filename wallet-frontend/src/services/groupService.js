import api from './api';

/**
 * Group Service
 * Handles all group CRUD operations
 */

// Get all groups
export const getGroups = async () => {
  const response = await api.get('/api/groups');
  return response.data;
};

// Get group by ID
export const getGroupById = async (id) => {
  const response = await api.get(`/api/groups/${id}`);
  return response.data;
};

// Create new group
export const createGroup = async (groupData) => {
  const response = await api.post('/api/groups', groupData);
  return response.data;
};

// Update group
export const updateGroup = async (id, groupData) => {
  const response = await api.put(`/api/groups/${id}`, groupData);
  return response.data;
};

// Delete group
export const deleteGroup = async (id) => {
  const response = await api.delete(`/api/groups/${id}`);
  return response.data;
};

export default {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
};
