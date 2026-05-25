import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Wallet,
  RefreshCw,
} from 'lucide-react';
import CommonButton from '../../components/common/CommonButton';
import CommonCard from '../../components/common/CommonCard';
import AccountTypeFormModal from '../../components/account-types/AccountTypeFormModal';
import TableSkeleton from '../../components/users/TableSkeleton';
import { getAccountTypes } from '../../services/api';
import { showSuccess, showError } from '../../components/common/Toast';

const AccountTypesManagement = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [typesPerPage] = useState(10);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const fetchAccountTypes = async () => {
    try {
      setLoading(true);
      const data = await getAccountTypes();
      setAccountTypes(data);
    } catch (error) {
      const message = error?.message || error?.error || 'Failed to fetch account types';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchAccountTypes();
  };

  const openAddModal = () => {
    setIsFormModalOpen(true);
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
  };

  // Filter account types based on search
  const filteredTypes = accountTypes.filter(
    (type) =>
      type.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastType = currentPage * typesPerPage;
  const indexOfFirstType = indexOfLastType - typesPerPage;
  const currentTypes = filteredTypes.slice(indexOfFirstType, indexOfLastType);
  const totalPages = Math.ceil(filteredTypes.length / typesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getTypeIcon = (typeName) => {
    const icons = {
      savings: '💰',
      checking: '💳',
      investment: '📈',
      business: '🏢',
      credit: '💎',
      loan: '🏦',
      fixed: '🔒',
      current: '💵',
    };
    return icons[typeName] || '👛';
  };

  const getTypeColor = (typeName) => {
    const colors = {
      savings: 'bg-blue-100 text-blue-800 border-blue-300',
      checking: 'bg-green-100 text-green-800 border-green-300',
      investment: 'bg-purple-100 text-purple-800 border-purple-300',
      business: 'bg-orange-100 text-orange-800 border-orange-300',
      credit: 'bg-red-100 text-red-800 border-red-300',
      loan: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      fixed: 'bg-gray-100 text-gray-800 border-gray-300',
      current: 'bg-teal-100 text-teal-800 border-teal-300',
    };
    return colors[typeName] || 'bg-indigo-100 text-indigo-800 border-indigo-300';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            Account Types Management
          </h1>
          <p className="text-gray-600 mt-1">Manage wallet account categories</p>
        </div>

        <div className="flex items-center gap-3">
          <CommonButton onClick={fetchAccountTypes} variant="secondary" icon={RefreshCw}>
            Refresh
          </CommonButton>
          <CommonButton onClick={openAddModal} variant="primary" icon={Plus}>
            Add Account Type
          </CommonButton>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Account Types</p>
              <p className="text-2xl font-bold text-gray-900">{accountTypes.length}</p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Standard Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {accountTypes.filter((t) => ['savings', 'checking', 'current'].includes(t.typeName)).length}
              </p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Specialized Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {accountTypes.filter((t) => !['savings', 'checking', 'current'].includes(t.typeName)).length}
              </p>
            </div>
          </div>
        </CommonCard>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CommonCard>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search account types..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </CommonCard>
      </motion.div>

      {/* Account Types Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CommonCard>
          {loading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Account Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type ID
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTypes.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="text-gray-400">
                            <Briefcase className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-lg font-medium">No account types found</p>
                            <p className="text-sm">
                              {searchTerm
                                ? 'Try adjusting your search'
                                : 'Add your first account type to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentTypes.map((type, index) => {
                        const isStandardType = ['savings', 'checking', 'current'].includes(type.typeName);
                        
                        return (
                          <motion.tr
                            key={type.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                  {getTypeIcon(type.typeName)}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 capitalize">
                                    {type.typeName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Account type #{type.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                                  type.typeName
                                )}`}
                              >
                                {type.typeName}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-500 font-mono">
                                #{type.id}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Active
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredTypes.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstType + 1} to{' '}
                    {Math.min(indexOfLastType, filteredTypes.length)} of{' '}
                    {filteredTypes.length} account types
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CommonCard>
      </motion.div>

      {/* Modal */}
      <AccountTypeFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default AccountTypesManagement;
