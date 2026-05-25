# 🏦 Complete Wallet Management Dashboard UI

## Production-Ready Enterprise Dashboard - Complete Code

Copy and paste these files into your Next.js project for an instant professional fintech dashboard.

---

## 1. Install Dependencies

```bash
cd c:\Users\Dell\wallet-management-systems\wallet-dashboard
npm install zustand framer-motion lucide-react react-toastify recharts
```

---

## 2. Update globals.css

**File**: `app/globals.css`

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --background: #F8FAFC;
  --foreground: #0F172A;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Inter', system-ui, sans-serif;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #F1F5F9;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  border-radius: 8px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
}
```

---

## 3. Create Zustand Store

**File**: `store/sidebarStore.ts`

```typescript
import { create } from 'zustand';

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));
```

---

## 4. Build Sidebar Component

**File**: `components/dashboard/Sidebar.tsx`

```typescript
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Shield, Key, Wallet,
  CreditCard, Coins, Settings, LogOut, Wallet as WalletIcon,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Shield, label: 'Groups', path: '/groups' },
  { icon: Key, label: 'Permissions', path: '/permissions' },
  { icon: Wallet, label: 'Accounts', path: '/accounts' },
  { icon: CreditCard, label: 'Account Types', path: '/account-types' },
  { icon: Coins, label: 'Currencies', path: '/currencies' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, mobileOpen, toggle, setMobileOpen } = useSidebarStore();

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
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                setMobileOpen(false);
              }}
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
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10">
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
    </>
  );
}
```

---

## 5. Build Navbar Component

**File**: `components/dashboard/Navbar.tsx`

```typescript
'use client';

import { Bell, Search, Menu, User } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

export default function Navbar() {
  const { setMobileOpen } = useSidebarStore();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg shadow-soft px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-48"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-xs text-gray-500">admin@wallet.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## 6. Create DashboardCard

**File**: `components/dashboard/DashboardCard.tsx`

```typescript
'use client';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({ children, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft p-6 card-hover ${className}`}>
      {children}
    </div>
  );
}
```

---

## 7. Create StatCard

**File**: `components/dashboard/StatCard.tsx`

```typescript
'use client';

import { LucideIcon } from 'lucide-react';
import DashboardCard from './DashboardCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: number;
}

export default function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <DashboardCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </DashboardCard>
  );
}
```

---

## 8. Build Dashboard Home Page

**File**: `app/page.tsx`

```typescript
'use client';

import { Users, Shield, Key, Wallet, CreditCard, Coins, TrendingUp, Plus, Download, RefreshCw } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import StatCard from '@/components/dashboard/StatCard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { motion } from 'framer-motion';

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
  const stats = [
    { title: 'Total Users', value: '2,543', icon: Users, color: 'blue', trend: 12 },
    { title: 'Total Groups', value: '18', icon: Shield, color: 'purple', trend: 5 },
    { title: 'Total Accounts', value: '4,892', icon: Wallet, color: 'green', trend: 8 },
    { title: 'Total Permissions', value: '24', icon: Key, color: 'orange', trend: 0 },
    { title: 'Total Currencies', value: '12', icon: Coins, color: 'pink', trend: 3 },
    { title: 'Total Balance', value: '$2.4M', icon: CreditCard, color: 'indigo', trend: 15 },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Created new account', time: '2 min ago', amount: '+$5,000' },
    { user: 'Jane Smith', action: 'Updated profile', time: '15 min ago', amount: null },
    { user: 'Mike Johnson', action: 'Transfer completed', time: '1 hour ago', amount: '-$1,200' },
    { user: 'Sarah Williams', action: 'New user registered', time: '3 hours ago', amount: null },
    { user: 'David Brown', action: 'Account deleted', time: '5 hours ago', amount: '$0' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:ml-[280px]">
        <Navbar />
        
        <main className="p-6 space-y-6">
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
              <button className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                <RefreshCw className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Sync</span>
              </button>
            </div>
          </DashboardCard>

          {/* Recent Activities */}
          <DashboardCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className={`font-semibold ${activity.amount.startsWith('+') ? 'text-green-600' : activity.amount.startsWith('-') ? 'text-red-600' : 'text-gray-900'}`}>
                        {activity.amount}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Wallet Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard>
              <h3 className="text-lg font-semibold mb-4">Account Distribution</h3>
              <div className="space-y-3">
                {[
                  { type: 'Savings', count: 1243, percentage: 45 },
                  { type: 'Business', count: 892, percentage: 32 },
                  { type: 'Current', count: 456, percentage: 16 },
                  { type: 'Wallet', count: 301, percentage: 7 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-sm text-gray-600">{item.count} accounts</span>
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
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {[
                  { desc: 'Payment received', amount: '+$2,500', status: 'Completed' },
                  { desc: 'Transfer to John', amount: '-$800', status: 'Pending' },
                  { desc: 'Deposit', amount: '+$5,000', status: 'Completed' },
                  { desc: 'Withdrawal', amount: '-$1,200', status: 'Processing' },
                ].map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{tx.desc}</p>
                      <p className="text-xs text-gray-500">{tx.status}</p>
                    </div>
                    <p className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount}
                    </p>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

## 9. Update Root Layout

**File**: `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallet Management System",
  description: "Enterprise Wallet Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## 10. Run Dashboard

```bash
cd c:\Users\Dell\wallet-management-systems\wallet-dashboard
npm run dev
```

Open: `http://localhost:3000`

---

## 🎨 Features Included

✅ Professional sidebar with gradient background  
✅ Collapsible sidebar with animations  
✅ Mobile responsive sidebar  
✅ Sticky navbar with search  
✅ User profile display  
✅ Welcome banner with gradient  
✅ 6 stat cards with icons and trends  
✅ Quick action buttons  
✅ Recent activities feed  
✅ Account distribution chart  
✅ Recent transactions list  
✅ Smooth Framer Motion animations  
✅ Card hover effects  
✅ Professional fintech design  
✅ Fully responsive  
✅ Production-ready code  

---

## 📂 File Structure

```
wallet-dashboard/
├── app/
│   ├── globals.css          ✅ Updated
│   ├── layout.tsx           ✅ Updated
│   └── page.tsx             ✅ Dashboard Home
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx      ✅ Created
│       ├── Navbar.tsx       ✅ Created
│       ├── DashboardCard.tsx ✅ Created
│       └── StatCard.tsx     ✅ Created
└── store/
    └── sidebarStore.ts      ✅ Created
```

---

**Ready to use! Just copy, paste, and run!** 🚀
