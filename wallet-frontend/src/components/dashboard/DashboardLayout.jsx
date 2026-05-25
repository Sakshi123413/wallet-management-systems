import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSidebarStore } from '../../store/sidebarStore';

export default function DashboardLayout() {
  const { collapsed } = useSidebarStore();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'Dashboard';
    if (path === '/dashboard/users') return 'Users Management';
    if (path === '/dashboard/accounts') return 'Accounts Management';
    if (path === '/dashboard/groups') return 'Groups Management';
    if (path === '/dashboard/permissions') return 'Permissions Management';
    if (path === '/dashboard/account-types') return 'Account Types Management';
    if (path === '/dashboard/currencies') return 'Currencies Management';
    if (path === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area - Desktop */}
      <div 
        className={`hidden lg:block min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
        }`}
      >
        {/* Navbar with dynamic title */}
        <Navbar title={getPageTitle()} />
        
        {/* Dynamic Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen">
        <Navbar title={getPageTitle()} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
