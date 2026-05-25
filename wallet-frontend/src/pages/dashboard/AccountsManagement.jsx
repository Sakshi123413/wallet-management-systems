import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import CommonButton from '../../components/common/CommonButton';
import CommonCard from '../../components/common/CommonCard';
import AccountFormModal from '../../components/accounts/AccountFormModal';
import AccountDetailsModal from '../../components/accounts/AccountDetailsModal';
import AccountDeleteModal from '../../components/accounts/AccountDeleteModal';
import TableSkeleton from '../../components/users/TableSkeleton';
import {
  getAccounts,
  getUsers,
  getAccountTypes,
  getCurrencies,
} from '../../services/api';
import { showSuccess, showError } from '../../components/common/Toast';

const AccountsManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [accountsData, usersData, typesData, currenciesData] = await Promise.all([
        getAccounts(),
        getUsers(),
        getAccountTypes(),
        getCurrencies(),
      ]);
      setAccounts(accountsData);
      setUsers(usersData);
      setAccountTypes(typesData);
      setCurrencies(currenciesData);
    } catch (error) {
      const message = error?.message || error?.error || 'Failed to fetch data';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchAllData();
  };

  const handleDeleteSuccess = () => {
    fetchAllData();
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    setIsFormModalOpen(true);
  };

  const openDetailsModal = (account) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const openDeleteModal = (account) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedAccount(null);
    setIsFormModalOpen(true);
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedAccount(null);
  };

  // Filter accounts based on search
  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.userId.toString().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);

  const formatCurrency = (amount, currencyCode = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const getCurrencyBadgeColor = (currencyCode) => {
    const colors = {
      USD: 'bg-green-100 text-green-800 border-green-200',
      EUR: 'bg-blue-100 text-blue-800 border-blue-200',
      GBP: 'bg-purple-100 text-purple-800 border-purple-200',
      INR: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[currencyCode] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAccountTypeIcon = (typeName) => {
    const icons = {
      savings: '💰',
      business: '💼',
      current: '🏦',
      wallet: '👛',
    };
    return icons[typeName] || '💳';
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
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            Accounts Management
          </h1>
          <p className="text-gray-600 mt-1">Manage wallet accounts and balances</p>
        </div>

        <div className="flex items-center gap-3">
          <CommonButton onClick={fetchAllData} variant="secondary" icon={RefreshCw}>
            Refresh
          </CommonButton>
          <CommonButton onClick={openAddModal} variant="primary" icon={Plus}>
            Add Account
          </CommonButton>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Types</p>
              <p className="text-2xl font-bold text-gray-900">{accountTypes.length}</p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Currencies</p>
              <p className="text-2xl font-bold text-gray-900">{currencies.length}</p>
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
              placeholder="Search by account type, currency, or user ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </CommonCard>
      </motion.div>

      {/* Accounts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CommonCard>
          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Currency
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Account ID
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentAccounts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="text-gray-400">
                            <Wallet className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-lg font-medium">No accounts found</p>
                            <p className="text-sm">
                              {searchTerm
                                ? 'Try adjusting your search'
                                : 'Add your first account to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentAccounts.map((account, index) => (
                        <motion.tr
                          key={account.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {getAccountTypeIcon(account.accountTypeName)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 capitalize">
                                  {account.accountTypeName}
                                </p>
                                <p className="text-xs text-gray-500">Account</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 font-mono">
                              #{account.userId}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCurrencyBadgeColor(
                                account.currencyCode
                              )}`}
                            >
                              {account.currencyCode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(account.balance, account.currencyCode)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500 font-mono">
                              #{account.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openDetailsModal(account)}
                                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(account)}
                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                title="Edit Account"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(account)}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                title="Delete Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredAccounts.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstAccount + 1} to{' '}
                    {Math.min(indexOfLastAccount, filteredAccounts.length)} of{' '}
                    {filteredAccounts.length} accounts
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
                              ? 'bg-blue-600 text-white'
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

      {/* Modals */}
      <AccountFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        account={selectedAccount}
        users={users}
        accountTypes={accountTypes}
        currencies={currencies}
        onSuccess={handleFormSuccess}
      />

      <AccountDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        account={selectedAccount}
      />

      <AccountDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        account={selectedAccount}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default AccountsManagement;
