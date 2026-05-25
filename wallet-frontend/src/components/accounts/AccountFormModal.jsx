import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, DollarSign, CreditCard, Coins } from 'lucide-react';
import CommonInput from '../common/CommonInput';
import CommonButton from '../common/CommonButton';
import { validateAccount } from '../../utils/validation';
import { createAccount, updateAccount } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const AccountFormModal = ({ isOpen, onClose, account, users, accountTypes, currencies, onSuccess }) => {
  const [formData, setFormData] = useState({
    userId: '',
    accountTypeId: '',
    currencyId: '',
    balance: '0.00',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!account;

  useEffect(() => {
    if (account) {
      setFormData({
        userId: account.userId || '',
        accountTypeId: account.accountTypeId || '',
        currencyId: account.currencyId || '',
        balance: account.balance?.toString() || '0.00',
      });
    } else {
      setFormData({
        userId: '',
        accountTypeId: '',
        currencyId: '',
        balance: '0.00',
      });
    }
    setErrors({});
  }, [account, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const validation = validateAccount({
      userId: Number(formData.userId),
      accountTypeId: Number(formData.accountTypeId),
      currencyId: Number(formData.currencyId),
      balance: formData.balance,
    });

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
        userId: Number(formData.userId),
        accountTypeId: Number(formData.accountTypeId),
        currencyId: Number(formData.currencyId),
        balance: parseFloat(formData.balance),
      };

      if (isEditMode) {
        await updateAccount(account.id, payload);
        showSuccess('Account updated successfully');
      } else {
        await createAccount(payload);
        showSuccess('Account created successfully');
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
    setFormData({ userId: '', accountTypeId: '', currencyId: '', balance: '0.00' });
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Account' : 'Add New Account'}
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
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Account Owner
                    </div>
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    disabled={isEditMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
                  )}
                </div>

                {/* Account Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Account Type
                    </div>
                  </label>
                  <select
                    name="accountTypeId"
                    value={formData.accountTypeId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select account type</option>
                    {accountTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.typeName}
                      </option>
                    ))}
                  </select>
                  {errors.accountTypeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.accountTypeId}</p>
                  )}
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Currency
                    </div>
                  </label>
                  <select
                    name="currencyId"
                    value={formData.currencyId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select currency</option>
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.currencyCode} - {currency.currencyName}
                      </option>
                    ))}
                  </select>
                  {errors.currencyId && (
                    <p className="mt-1 text-sm text-red-600">{errors.currencyId}</p>
                  )}
                </div>

                {/* Balance Input */}
                <CommonInput
                  type="text"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  label="Initial Balance"
                  placeholder="0.00"
                  icon={DollarSign}
                  error={errors.balance}
                />

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
                    {isEditMode ? 'Update Account' : 'Create Account'}
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

export default AccountFormModal;
