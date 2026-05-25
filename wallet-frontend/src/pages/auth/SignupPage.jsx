import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Shield, Users, CreditCard, TrendingUp, User, Mail, Lock, Eye, EyeOff, Key } from 'lucide-react';
import CommonInput from '../../components/common/CommonInput';
import CommonButton from '../../components/common/CommonButton';
import CommonSelect from '../../components/common/CommonSelect';
import CommonCard from '../../components/common/CommonCard';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../../utils/helpers';
import { getGroups } from '../../services/groupService';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    groupId: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [groupOptions, setGroupOptions] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  // Fetch groups dynamically from backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);
        const groups = await getGroups();
        
        // Transform groups API response to select options format
        const options = groups.map(group => ({
          value: group.id.toString(),
          label: group.name,
        }));
        
        setGroupOptions(options);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        // Fallback to empty array - user will see error message
        setGroupOptions([]);
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password should contain uppercase, lowercase and number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Group validation
    if (!formData.groupId) {
      newErrors.groupId = 'Please select a group';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Call signup API using useAuth hook
    const result = await signup({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      groupId: parseInt(formData.groupId),
    });
    
    if (result.success) {
      // Redirect to dashboard after successful signup (auto-login)
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 animate-fade-in">
          {/* Logo & Title */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-2xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Wallet Management System</h1>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create Your Secure<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Wallet Account
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
              Join our secure financial ecosystem. Manage your wallets, monitor transactions, 
              and experience next-generation digital finance with enterprise-grade security.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-start gap-3 p-5 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Secure User Registration</h3>
                <p className="text-gray-400 text-xs">Encrypted credentials with BCrypt hashing</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 p-5 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Group-based Access</h3>
                <p className="text-gray-400 text-xs">Role-based permissions for teams</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 p-5 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Smart Wallet Controls</h3>
                <p className="text-gray-400 text-xs">Advanced wallet management tools</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 p-5 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Real-time Transaction System</h3>
                <p className="text-gray-400 text-xs">Instant transaction processing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-12 text-sm text-gray-400">
          <p>© 2026 Wallet Management System. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="lg:w-1/2 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8 md:p-12 lg:p-16 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md my-8">
          <CommonCard>
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Get Started
              </h2>
              <p className="text-gray-600">
                Create your account in seconds
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <CommonInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                label="Full Name"
                placeholder="Enter your full name"
                icon={User}
                error={errors.name}
                autoComplete="name"
              />

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
                  placeholder="Create a strong password"
                  icon={Lock}
                  error={errors.password}
                  autoComplete="new-password"
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

              <div className="relative">
                <CommonInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  icon={Key}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <CommonSelect
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                label="Group"
                placeholder={groupsLoading ? "Loading groups..." : "Select your group"}
                icon={Users}
                options={groupOptions}
                error={errors.groupId}
                disabled={groupsLoading}
              />

              {/* Signup Button */}
              <CommonButton
                type="submit"
                loading={loading}
                variant="primary"
                className="mt-6"
              >
                Create Account
              </CommonButton>
            </form>

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Sign in now
                </a>
              </p>
            </div>
          </CommonCard>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
