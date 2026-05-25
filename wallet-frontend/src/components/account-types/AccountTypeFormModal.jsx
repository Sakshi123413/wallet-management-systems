import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Briefcase } from 'lucide-react';
import CommonInput from '../common/CommonInput';
import CommonButton from '../common/CommonButton';
import { validateAccountType } from '../../utils/validation';
import { createAccountType } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const AccountTypeFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    typeName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ typeName: '' });
    setErrors({});
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-convert to lowercase
    setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const validation = validateAccountType(formData);

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
        typeName: formData.typeName.trim().toLowerCase(),
      };

      await createAccountType(payload);
      showSuccess('Account type created successfully');

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
    setFormData({ typeName: '' });
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
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create Account Type
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
                  name="typeName"
                  value={formData.typeName}
                  onChange={handleChange}
                  label="Account Type Name"
                  placeholder="e.g., savings, checking, investment"
                  icon={Wallet}
                  error={errors.typeName}
                />

                {/* Info Box */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-900">
                    <strong>Tip:</strong> Common types include savings, checking, investment, business, credit
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
                    Create Account Type
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

export default AccountTypeFormModal;
