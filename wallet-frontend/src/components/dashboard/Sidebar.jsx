import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Shield, Key, Wallet,
  CreditCard, Coins, Settings, LogOut, Wallet as WalletIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuth } from '../../hooks/useAuth';
import { LogoutModal } from '../common';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Users', path: '/dashboard/users' },
  { icon: Shield, label: 'Groups', path: '/dashboard/groups' },
  { icon: Key, label: 'Permissions', path: '/dashboard/permissions' },
  { icon: Wallet, label: 'Accounts', path: '/dashboard/accounts' },
  { icon: CreditCard, label: 'Account Types', path: '/dashboard/account-types' },
  { icon: Coins, label: 'Currencies', path: '/dashboard/currencies' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed, mobileOpen, toggle, setMobileOpen } = useSidebarStore();
  const { logout, logoutLoading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    const result = await logout();
    
    // Navigate to login after successful logout
    if (result.success) {
      navigate('/login', { replace: true });
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
            <WalletIcon className="w-6 h-6" />
          </div>
          {!collapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold"
            >
              Wallet MS
            </motion.h1>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        className="hidden lg:block fixed left-0 top-0 h-screen z-40"
      >
        {sidebarContent}
        <button
          onClick={toggle}
          className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <motion.div initial={{ x: -300 }} animate={{ x: 0 }} className="relative w-72 h-full">
            {sidebarContent}
          </motion.div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </>
  );
}
