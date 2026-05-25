import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Shield, TrendingUp, Users, CreditCard, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import CommonInput from '../../components/common/CommonInput';
import CommonButton from '../../components/common/CommonButton';
import CommonCard from '../../components/common/CommonCard';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../../utils/helpers';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 animate-fade-in">
          {/* Logo & Title */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-2xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Wallet Management System</h1>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Smart Digital<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Wallet Management
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
              Experience secure wallet transactions, intelligent account management, 
              real-time analytics, and complete financial control - all in one platform.
            </p>
          </div>

          {/* Feature Points */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Authentication</h3>
                <p className="text-gray-400 text-sm">Enterprise-grade security with JWT token-based authentication</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Real-time Wallet Tracking</h3>
                <p className="text-gray-400 text-sm">Monitor your wallet balances and transactions in real-time</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Multi-user Access</h3>
                <p className="text-gray-400 text-sm">Role-based access control for seamless team collaboration</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Transaction Management</h3>
                <p className="text-gray-400 text-sm">Comprehensive transaction history and financial analytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-12 text-sm text-gray-400">
          <p>© 2026 Wallet Management System. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-50 via-white to-lavender-50 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <CommonCard>
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your wallet
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <CommonInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email Address"
                placeholder="Enter your email"
                icon={Mail}
                error={errors.email}
                autoComplete="email"
              />

              <div className="relative">
                <CommonInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  label="Password"
                  placeholder="Enter your password"
                  icon={Lock}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <CommonButton
                type="submit"
                loading={loading}
                variant="primary"
              >
                Sign In
              </CommonButton>
            </form>

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/signup');
                  }}
                >
                  Sign up now
                </a>
              </p>
            </div>
          </CommonCard>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
