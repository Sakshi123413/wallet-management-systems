import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Key } from 'lucide-react';
import CommonButton from '../common/CommonButton';
import { deletePermission as deletePermissionApi } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const PermissionDeleteModal = ({ isOpen, onClose, permission, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!permission) return;

    try {
      setLoading(true);
      await deletePermissionApi(permission.id);
      showSuccess(`Permission "${permission.name}" deleted successfully`);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error?.message || error?.error || 'Delete operation failed';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && permission && (
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
              {/* Header with Warning Icon */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Delete Permission</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete this permission?
                  </p>
                  
                  {/* Permission Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3 border border-blue-100">
                    <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 uppercase font-semibold">Permission Name</p>
                        <p className="text-lg font-bold text-gray-900">{permission.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Permission ID:</span>
                      <span className="font-semibold text-gray-900 font-mono">#{permission.id}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> This action cannot be undone. Groups assigned to this permission will lose access.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <CommonButton
                    onClick={onClose}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </CommonButton>
                  <CommonButton
                    onClick={handleDelete}
                    loading={loading}
                    variant="danger"
                    className="flex-1"
                  >
                    Delete Permission
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

export default PermissionDeleteModal;
