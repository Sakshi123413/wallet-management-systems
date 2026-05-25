import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Check, Key } from 'lucide-react';
import CommonInput from '../common/CommonInput';
import CommonButton from '../common/CommonButton';
import { validateGroup } from '../../utils/validation';
import { createGroup, updateGroup } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const GroupFormModal = ({ isOpen, onClose, group, permissions, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    permissionIds: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!group;

  useEffect(() => {
    if (group) {
      // Extract permission IDs from the group's permissions array
      const permissionIds = group.permissions
        ? permissions
            .filter((p) => group.permissions.includes(p.name))
            .map((p) => p.id)
        : [];
      
      setFormData({
        name: group.name || '',
        permissionIds: permissionIds,
      });
    } else {
      setFormData({
        name: '',
        permissionIds: [],
      });
    }
    setErrors({});
  }, [group, permissions, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const togglePermission = (permissionId) => {
    setFormData((prev) => {
      const currentIds = prev.permissionIds || [];
      const newIds = currentIds.includes(permissionId)
        ? currentIds.filter((id) => id !== permissionId)
        : [...currentIds, permissionId];
      
      return { ...prev, permissionIds: newIds };
    });
    
    if (errors.permissionIds) {
      setErrors((prev) => ({ ...prev, permissionIds: '' }));
    }
  };

  const validate = () => {
    const validation = validateGroup(formData);

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
        name: formData.name.toUpperCase(),
        permissionIds: formData.permissionIds && formData.permissionIds.length > 0 
          ? formData.permissionIds 
          : [],
      };

      if (isEditMode) {
        await updateGroup(group.id, payload);
        showSuccess('Group updated successfully');
      } else {
        await createGroup(payload);
        showSuccess('Group created successfully');
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
    setFormData({ name: '', permissionIds: [] });
    setErrors({});
    onClose();
  };

  const getPermissionColor = (permissionName) => {
    const colors = {
      READ: 'bg-blue-100 text-blue-800 border-blue-300',
      WRITE: 'bg-green-100 text-green-800 border-green-300',
      DELETE: 'bg-red-100 text-red-800 border-red-300',
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[permissionName] || 'bg-gray-100 text-gray-800 border-gray-300';
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Group' : 'Create New Group'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Group Name */}
                <CommonInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Group Name"
                  placeholder="e.g., MANAGER, SUPERVISOR"
                  icon={Shield}
                  error={errors.name}
                />

                {/* Permissions Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Permissions
                      <span className="text-xs text-gray-500 font-normal">
                        (Select at least one)
                      </span>
                    </div>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {permissions.map((permission) => {
                      const isSelected = formData.permissionIds.includes(permission.id);
                      return (
                        <motion.button
                          key={permission.id}
                          type="button"
                          onClick={() => togglePermission(permission.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPermissionColor(
                                  permission.name
                                )}`}
                              >
                                {permission.name}
                              </div>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-purple-500 rounded-full p-1"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-left">
                            {permission.name === 'READ' && 'View and read data'}
                            {permission.name === 'WRITE' && 'Create and update data'}
                            {permission.name === 'DELETE' && 'Remove and delete data'}
                            {permission.name === 'ADMIN' && 'Full administrative access'}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {errors.permissionIds && (
                    <p className="mt-2 text-sm text-red-600">{errors.permissionIds}</p>
                  )}
                  
                  {/* Selected Permissions Summary */}
                  {formData.permissionIds.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Selected Permissions ({formData.permissionIds.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {permissions
                          .filter((p) => formData.permissionIds.includes(p.id))
                          .map((p) => (
                            <span
                              key={p.id}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPermissionColor(
                                p.name
                              )}`}
                            >
                              {p.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                    {isEditMode ? 'Update Group' : 'Create Group'}
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

export default GroupFormModal;
