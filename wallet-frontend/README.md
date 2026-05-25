# Wallet Management System - Frontend

A modern, professional React + Tailwind CSS frontend for the Wallet Management System with enterprise-level UI/UX design.

## 🚀 Features

- **Split-Screen Login Page**: Modern design with branding section and login form
- **Reusable Components**: CommonInput, CommonButton, CommonCard, Loader, Toast
- **JWT Authentication**: Secure login with token storage
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Smooth Animations**: Fade-in, slide-up, shake effects
- **Glassmorphism UI**: Modern glass-effect cards
- **Form Validation**: Real-time validation with error messages
- **Toast Notifications**: Success, error, warning, and info messages
- **Protected Routes**: Authentication-based route protection
- **Axios Integration**: API calls with interceptors

## 📁 Project Structure

```
wallet-frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── CommonInput.jsx       # Reusable input component
│   │       ├── CommonButton.jsx      # Reusable button component
│   │       ├── CommonCard.jsx        # Glassmorphism card component
│   │       ├── Loader.jsx            # Loading spinner component
│   │       └── Toast.jsx             # Toast notification wrappers
│   ├── pages/
│   │   └── auth/
│   │       ├── LoginPage.jsx         # Login page with split-screen
│   │       └── Dashboard.jsx         # User dashboard (placeholder)
│   ├── services/
│   │   └── api.js                    # Axios API configuration
│   ├── hooks/
│   │   └── useAuth.js                # Authentication hook
│   ├── utils/
│   │   └── helpers.js                # Utility functions
│   ├── App.jsx                       # Main app with routing
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles & Tailwind
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.mjs
└── postcss.config.js
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Modern icon library

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open automatically on `http://localhost:3000` (or next available port).

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🔐 Login Credentials

To test the login, ensure your backend is running and use:

- **Email**: Any registered email in the system
- **Password**: The password used during signup

### Testing with Backend

1. Start the backend: `./gradlew bootRun`
2. Sign up a new user via the API or use an existing one
3. Login through the frontend

## 🎨 UI Features

### Login Page

**Left Side (Branding):**
- Dark gradient background
- Professional branding with logo
- Feature highlights with icons:
  - Secure Authentication
  - Real-time Wallet Tracking
  - Multi-user Access
  - Transaction Management
- Smooth animations

**Right Side (Form):**
- Glassmorphism card effect
- Email and password inputs with icons
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Loading spinner during login
- Form validation with error messages

### Dashboard

- User profile display
- Welcome message
- User information cards
- Logout functionality
- Placeholder for future features

## 🔄 Authentication Flow

1. User enters email and password
2. Frontend validates inputs
3. API call to `POST http://localhost:8080/api/auth/login`
4. On success:
   - JWT token stored in `localStorage` as `wallet_token`
   - User data stored as `wallet_user`
   - Redirect to `/dashboard`
5. On error:
   - Toast notification with error message
   - Form shake animation

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px (40/60 split)
- **Desktop**: > 1024px (50/50 split)

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🔧 Configuration

### API Base URL

Update in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080';
```

### Tailwind Theme

Customize in `tailwind.config.mjs`:

```javascript
colors: {
  lavender: {
    50: '#f5f3ff',
    // ... more shades
  }
}
```

## 📦 LocalStorage Keys

- `wallet_token`: JWT authentication token
- `wallet_user`: User object (userId, email, name)

## 🎨 Custom Components

### CommonInput
```jsx
<CommonInput
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  label="Email Address"
  placeholder="Enter your email"
  icon={Mail}
  error={errors.email}
/>
```

### CommonButton
```jsx
<CommonButton
  type="submit"
  loading={loading}
  variant="primary"
>
  Sign In
</CommonButton>
```

### CommonCard
```jsx
<CommonCard>
  {/* Your content */}
</CommonCard>
```

## 🔒 Security Features

- JWT token-based authentication
- Automatic token attachment to API requests
- Protected routes with authentication check
- Auto-redirect on 401 errors
- Secure password handling

## 🌟 Future Enhancements

- [ ] Signup page
- [ ] Forgot password flow
- [ ] Wallet management dashboard
- [ ] Transaction history
- [ ] Analytics charts
- [ ] Multi-wallet support
- [ ] Dark mode toggle
- [ ] Profile management
- [ ] Account settings

## 📄 License

This project is part of the Wallet Management System.

## 🤝 Support

For issues or questions, please check:
- Backend API logs
- Browser console for errors
- Network tab for API calls

---

**Built with ❤️ using React + Tailwind CSS**
