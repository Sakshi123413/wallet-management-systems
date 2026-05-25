import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/auth/Dashboard';
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
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/users" 
          element={
            <ProtectedRoute>
              <UsersManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/accounts" 
          element={
            <ProtectedRoute>
              <AccountsManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/groups" 
          element={
            <ProtectedRoute>
              <GroupsManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/permissions" 
          element={
            <ProtectedRoute>
              <PermissionsManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/account-types" 
          element={
            <ProtectedRoute>
              <AccountTypesManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/currencies" 
          element={
            <ProtectedRoute>
              <CurrenciesManagement />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
