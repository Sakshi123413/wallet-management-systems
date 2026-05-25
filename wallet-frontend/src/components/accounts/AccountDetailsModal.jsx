import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, User, CreditCard, DollarSign, Hash } from 'lucide-react';
import CommonButton from '../common/CommonButton';

const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  if (!account) return null;

  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && account && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Account Details</h2>
                      <p className="text-sm text-white/80">Account #{account.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Balance Card */}
              <div className="mx-6 -mt-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-4xl font-bold text-gray-900">
                  {formatCurrency(account.balance, account.currencyCode)}
                </p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-semibold text-blue-600 border border-blue-200">
                  {account.currencyCode}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">User ID</p>
                    <p className="text-sm font-medium text-gray-900">#{account.userId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Account Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {account.accountTypeName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Currency</p>
                    <p className="text-sm font-medium text-gray-900">{account.currencyCode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Hash className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Account ID</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">#{account.id}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  <CommonButton onClick={onClose} variant="primary">
                    Close
                  </CommonButton>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountDetailsModal;
