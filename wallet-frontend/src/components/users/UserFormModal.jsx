import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Shield } from 'lucide-react';
import CommonInput from '../common/CommonInput';
import CommonButton from '../common/CommonButton';
import { validateUser, validateUserUpdate } from '../../utils/validation';
import { createUser, updateUser } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const UserFormModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    groupId: 2, // Default to USER group
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        groupId: user.groupId || 2,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        groupId: 2,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const validation = isEditMode
      ? validateUserUpdate(formData)
      : validateUser(formData);

    if (!validation.success) {
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
    setFormData({ name: '', email: '', password: '', groupId: 2 });
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
                  <select
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value={1}>ADMIN</option>
                    <option value={2}>USER</option>
                  </select>
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
