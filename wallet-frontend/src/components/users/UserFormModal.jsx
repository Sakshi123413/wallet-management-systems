import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Shield, Loader2 } from 'lucide-react';
import CommonInput from '../common/CommonInput';
import CommonButton from '../common/CommonButton';
import { validateUser, validateUserUpdate } from '../../utils/validation';
import { createUser, updateUser, getGroups } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const UserFormModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    groupId: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState(false);

  const isEditMode = !!user;

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        groupId: user.groupId || null,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        groupId: groups.length > 0 ? groups[0].id : null,
      });
    }
    setErrors({});
  }, [user, isOpen, groups]);

  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      setGroupsError(false);
      const data = await getGroups();
      setGroups(data);
      // Set default group to first available group if creating new user
      if (!user && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          groupId: prev.groupId || data[0].id,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      setGroupsError(true);
      showError('Failed to load user groups');
    } finally {
      setGroupsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert groupId to number for proper validation
    const processedValue = name === 'groupId' ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const validation = isEditMode
      ? validateUserUpdate(formData)
      : validateUser(formData);

    if (!validation.success) {
      console.error('Validation failed:', validation.error.errors);
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        groupId: formData.groupId,
      };

      // Only include password if provided (for edit mode)
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditMode) {
        await updateUser(user.id, payload);
        showSuccess('User updated successfully');
      } else {
        await createUser(payload);
        showSuccess('User created successfully');
      }

      onSuccess();
      handleClose();
    } catch (error) {
      const message = error?.message || error?.error || 'Operation failed';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', groupId: null });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <CommonInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Full Name"
                  placeholder="Enter full name"
                  icon={User}
                  error={errors.name}
                />

                <CommonInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email Address"
                  placeholder="Enter email address"
                  icon={Mail}
                  error={errors.email}
                />

                <CommonInput
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  label={isEditMode ? 'New Password (optional)' : 'Password'}
                  placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                  icon={Lock}
                  error={errors.password}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      User Group
                    </div>
                  </label>
                  {groupsLoading ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">Loading groups...</span>
                    </div>
                  ) : groupsError ? (
                    <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50">
                      <p className="text-sm text-red-600">Failed to load groups</p>
                      <button
                        type="button"
                        onClick={fetchGroups}
                        className="text-sm text-red-600 underline mt-1 hover:text-red-700"
                      >
                        Retry
                      </button>
                    </div>
                  ) : groups.length === 0 ? (
                    <div className="w-full px-4 py-3 border border-yellow-300 rounded-lg bg-yellow-50">
                      <p className="text-sm text-yellow-700">No groups available</p>
                      <p className="text-xs text-yellow-600 mt-1">Please create a group first in Groups Management</p>
                    </div>
                  ) : (
                    <select
                      name="groupId"
                      value={formData.groupId || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                      required
                    >
                      <option value="" disabled>Select a group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.groupId && (
                    <p className="mt-1 text-sm text-red-600">{errors.groupId}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <CommonButton
                    type="button"
                    onClick={handleClose}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </CommonButton>
                  <CommonButton
                    type="submit"
                    loading={loading}
                    variant="primary"
                    className="flex-1"
                  >
                    {isEditMode ? 'Update User' : 'Create User'}
                  </CommonButton>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;
