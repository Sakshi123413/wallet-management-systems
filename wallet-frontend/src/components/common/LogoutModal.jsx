import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import CommonButton from './CommonButton';

const LogoutModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onClose : undefined}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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
              {/* Header with warning icon */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>
                </div>
                {!loading && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to logout from your account?
                </p>
                <p className="text-sm text-gray-500">
                  You will be redirected to the login page and will need to sign in again to access your dashboard.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 pt-0">
                <CommonButton
                  type="button"
                  onClick={onClose}
                  variant="secondary"
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </CommonButton>
                <CommonButton
                  type="button"
                  onClick={onConfirm}
                  variant="danger"
                  loading={loading}
                  className="flex-1"
                >
                  Yes, Logout
                </CommonButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
