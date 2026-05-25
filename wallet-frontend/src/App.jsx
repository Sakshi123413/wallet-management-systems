import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/auth/Dashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import UsersManagement from './pages/dashboard/UsersManagement';
import AccountsManagement from './pages/dashboard/AccountsManagement';
import GroupsManagement from './pages/dashboard/GroupsManagement';
import PermissionsManagement from './pages/dashboard/PermissionsManagement';
import AccountTypesManagement from './pages/dashboard/AccountTypesManagement';
import CurrenciesManagement from './pages/dashboard/CurrenciesManagement';
import { isAuthenticated } from './services/authService';

// Protected Route Component - Optimized to prevent infinite loops
const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAuth, setIsAuth] = React.useState(false);

  React.useEffect(() => {
    // Check authentication only once on mount
    try {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuth(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/dashboard-old" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard Layout with Nested Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="accounts" element={<AccountsManagement />} />
          <Route path="groups" element={<GroupsManagement />} />
          <Route path="permissions" element={<PermissionsManagement />} />
          <Route path="account-types" element={<AccountTypesManagement />} />
          <Route path="currencies" element={<CurrenciesManagement />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
