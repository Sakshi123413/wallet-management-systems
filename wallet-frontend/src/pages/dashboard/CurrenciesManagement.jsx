import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  RefreshCw,
} from 'lucide-react';
import CommonButton from '../../components/common/CommonButton';
import CommonCard from '../../components/common/CommonCard';
import CurrencyFormModal from '../../components/currencies/CurrencyFormModal';
import TableSkeleton from '../../components/users/TableSkeleton';
import { getCurrencies } from '../../services/api';
import { showSuccess, showError } from '../../components/common/Toast';

const CurrenciesManagement = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currenciesPerPage] = useState(10);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const data = await getCurrencies();
      setCurrencies(data);
    } catch (error) {
      const message = error?.message || error?.error || 'Failed to fetch currencies';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchCurrencies();
  };

  const openAddModal = () => {
    setIsFormModalOpen(true);
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
  };

  // Filter currencies based on search
  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.currencyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCurrency = currentPage * currenciesPerPage;
  const indexOfFirstCurrency = indexOfLastCurrency - currenciesPerPage;
  const currentCurrencies = filteredCurrencies.slice(indexOfFirstCurrency, indexOfLastCurrency);
  const totalPages = Math.ceil(filteredCurrencies.length / currenciesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥',
      AUD: 'A$',
      CAD: 'C$',
      CHF: 'CHF',
      CNY: '¥',
      SGD: 'S$',
      AED: 'د.إ',
    };
    return symbols[currencyCode] || currencyCode.charAt(0);
  };

  const getCurrencyColor = (currencyCode) => {
    const colors = {
      USD: 'bg-green-100 text-green-800 border-green-300',
      EUR: 'bg-blue-100 text-blue-800 border-blue-300',
      GBP: 'bg-purple-100 text-purple-800 border-purple-300',
      INR: 'bg-orange-100 text-orange-800 border-orange-300',
      JPY: 'bg-red-100 text-red-800 border-red-300',
      AUD: 'bg-teal-100 text-teal-800 border-teal-300',
      CAD: 'bg-red-100 text-red-800 border-red-300',
      CHF: 'bg-gray-100 text-gray-800 border-gray-300',
      CNY: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      SGD: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      AED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
    return colors[currencyCode] || 'bg-cyan-100 text-cyan-800 border-cyan-300';
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
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
              <Globe className="w-7 h-7 text-white" />
            </div>
            Currency Management
          </h1>
          <p className="text-gray-600 mt-1">Manage supported currencies for wallets</p>
        </div>

        <div className="flex items-center gap-3">
          <CommonButton onClick={fetchCurrencies} variant="secondary" icon={RefreshCw}>
            Refresh
          </CommonButton>
          <CommonButton onClick={openAddModal} variant="primary" icon={Plus}>
            Add Currency
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
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Currencies</p>
              <p className="text-2xl font-bold text-gray-900">{currencies.length}</p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Major Currencies</p>
              <p className="text-2xl font-bold text-gray-900">
                {currencies.filter((c) => ['USD', 'EUR', 'GBP', 'INR', 'JPY'].includes(c.currencyCode)).length}
              </p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Regional Currencies</p>
              <p className="text-2xl font-bold text-gray-900">
                {currencies.filter((c) => !['USD', 'EUR', 'GBP', 'INR', 'JPY'].includes(c.currencyCode)).length}
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
              placeholder="Search currencies by code or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </CommonCard>
      </motion.div>

      {/* Currency Table */}
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
                        Currency
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Currency ID
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCurrencies.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="text-gray-400">
                            <Globe className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-lg font-medium">No currencies found</p>
                            <p className="text-sm">
                              {searchTerm
                                ? 'Try adjusting your search'
                                : 'Add your first currency to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentCurrencies.map((currency, index) => {
                        const isMajorCurrency = ['USD', 'EUR', 'GBP', 'INR', 'JPY'].includes(currency.currencyCode);
                        
                        return (
                          <motion.tr
                            key={currency.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold">
                                  {getCurrencySymbol(currency.currencyCode)}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{currency.currencyName}</p>
                                  <p className="text-xs text-gray-500">
                                    {isMajorCurrency ? 'Major Currency' : 'Regional Currency'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getCurrencyColor(
                                  currency.currencyCode
                                )}`}
                              >
                                <span className="text-lg">{getCurrencySymbol(currency.currencyCode)}</span>
                                {currency.currencyCode}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-500 font-mono">
                                #{currency.id}
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
              {filteredCurrencies.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstCurrency + 1} to{' '}
                    {Math.min(indexOfLastCurrency, filteredCurrencies.length)} of{' '}
                    {filteredCurrencies.length} currencies
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
                              ? 'bg-emerald-600 text-white'
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
      <CurrencyFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default CurrenciesManagement;
