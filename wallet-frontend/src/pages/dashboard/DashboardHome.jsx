import React, { useState, useEffect, useCallback } from 'react';
import { Users, Shield, Key, Wallet, CreditCard, Coins, Plus, Download, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/dashboard/StatCard';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { getUsers } from '../../services/userService';
import { getAccounts } from '../../services/accountService';
import { getGroups } from '../../services/groupService';
import { getPermissions } from '../../services/permissionService';
import { getCurrencies } from '../../services/currencyService';
import { showSuccess, showError } from '../../components/common/Toast';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    accounts: [],
    groups: [],
    permissions: [],
    currencies: [],
  });
  const [stats, setStats] = useState([]);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel for performance
      const [users, accounts, groups, permissions, currencies] = await Promise.all([
        getUsers(),
        getAccounts(),
        getGroups(),
        getPermissions(),
        getCurrencies(),
      ]);

      setDashboardData({ users, accounts, groups, permissions, currencies });

      // Calculate total balance from all accounts
      const totalBalance = accounts.reduce((sum, account) => {
        return sum + (parseFloat(account.balance) || 0);
      }, 0);

      // Format stats dynamically
      setStats([
        { 
          title: 'Total Users', 
          value: users.length.toLocaleString(), 
          icon: Users, 
          color: 'blue', 
          trend: calculateTrend(users.length, 100) 
        },
        { 
          title: 'Total Groups', 
          value: groups.length.toString(), 
          icon: Shield, 
          color: 'purple', 
          trend: calculateTrend(groups.length, 10) 
        },
        { 
          title: 'Total Accounts', 
          value: accounts.length.toLocaleString(), 
          icon: Wallet, 
          color: 'green', 
          trend: calculateTrend(accounts.length, 100) 
        },
        { 
          title: 'Total Permissions', 
          value: permissions.length.toString(), 
          icon: Key, 
          color: 'orange', 
          trend: 0 
        },
        { 
          title: 'Total Currencies', 
          value: currencies.length.toString(), 
          icon: Coins, 
          color: 'pink', 
          trend: calculateTrend(currencies.length, 5) 
        },
        { 
          title: 'Total Balance', 
          value: formatCurrency(totalBalance), 
          icon: CreditCard, 
          color: 'indigo', 
          trend: calculateTrend(totalBalance, 100000) 
        },
      ]);

      showSuccess('Dashboard data refreshed');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper: Calculate trend percentage (mock for now, can be enhanced with historical data)
  function calculateTrend(current, baseline) {
    if (!baseline) return 0;
    const percentage = Math.round(((current - baseline) / baseline) * 100);
    return Math.max(-99, Math.min(99, percentage));
  }

  // Helper: Format currency
  function formatCurrency(amount) {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(2)}`;
  }

  // Helper: Format relative time
  function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
  }

  // Get recent users (last 5)
  const recentUsers = dashboardData.users
    .slice(-5)
    .reverse()
    .map(user => ({
      name: user.name || user.email,
      email: user.email,
      createdAt: user.createdAt || new Date().toISOString(),
    }));

  // Get recent accounts (last 5)
  const recentAccounts = dashboardData.accounts
    .slice(-5)
    .reverse()
    .map(account => ({
      accountNumber: account.accountNumber || `ACC-${account.id}`,
      balance: account.balance || 0,
      createdAt: account.createdAt || new Date().toISOString(),
    }));

  // Calculate account type distribution
  const accountTypeDistribution = dashboardData.accounts.reduce((acc, account) => {
    const type = account.accountType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const totalAccounts = dashboardData.accounts.length;
  const accountDistribution = Object.entries(accountTypeDistribution)
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalAccounts > 0 ? Math.round((count / totalAccounts) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100 text-lg">
          Here's what's happening with your wallet management system today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Actions */}
      <DashboardCard>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            <Plus className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Add User</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
            <Wallet className="w-5 h-5 text-green-600" />
            <span className="font-medium">New Account</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
            <Download className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Export Data</span>
          </button>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-orange-600" />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      </DashboardCard>

      {/* Recent Users */}
      <DashboardCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Users</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No users yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{formatRelativeTime(user.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Recent Accounts */}
      <DashboardCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Accounts</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : recentAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No accounts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-sm">{account.accountNumber}</p>
                  <p className="text-xs text-gray-500">Created {formatRelativeTime(account.createdAt)}</p>
                </div>
                <p className="font-semibold text-green-600">
                  ${parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Distribution */}
        <DashboardCard>
          <h3 className="text-lg font-semibold mb-4">Account Distribution</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2"></div>
                </div>
              ))}
            </div>
          ) : accountDistribution.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No account data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accountDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm text-gray-600">{item.count} accounts ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* System Statistics */}
        <DashboardCard>
          <h3 className="text-lg font-semibold mb-4">System Statistics</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Total Users</p>
                  <p className="text-xs text-gray-500">Active accounts</p>
                </div>
                <p className="font-bold text-blue-600">{dashboardData.users.length}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Total Accounts</p>
                  <p className="text-xs text-gray-500">Wallet accounts</p>
                </div>
                <p className="font-bold text-green-600">{dashboardData.accounts.length}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Total Groups</p>
                  <p className="text-xs text-gray-500">User groups</p>
                </div>
                <p className="font-bold text-purple-600">{dashboardData.groups.length}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Total Permissions</p>
                  <p className="text-xs text-gray-500">Access controls</p>
                </div>
                <p className="font-bold text-orange-600">{dashboardData.permissions.length}</p>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
