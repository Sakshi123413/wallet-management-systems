import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Shield } from 'lucide-react';
import CommonInput from '../common/CommonInput';
import CommonButton from '../common/CommonButton';
import { validatePermission } from '../../utils/validation';
import { createPermission } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const PermissionFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ name: '' });
    setErrors({});
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-convert to uppercase
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const validation = validatePermission(formData);

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
        name: formData.name.trim(),
      };

      await createPermission(payload);
      showSuccess('Permission created successfully');

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
    setFormData({ name: '' });
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
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Permission
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
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <CommonInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Permission Name"
                  placeholder="e.g., EXPORT, IMPORT, MANAGE"
                  icon={Shield}
                  error={errors.name}
                />

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Tip:</strong> Permission names should be uppercase with underscores (e.g., EXPORT_DATA, VIEW_REPORTS)
                  </p>
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
                    Create Permission
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

export default PermissionFormModal;
