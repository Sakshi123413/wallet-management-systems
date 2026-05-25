# 📝 Signup Page - Wallet Management System

## Overview

A modern, professional signup page with split-screen layout, enterprise-level UI/UX design, and seamless integration with the Wallet Management System backend API.

---

## 🎨 Design Features

### **Split-Screen Layout**

#### **Left Side (Branding)**
- **Dark Gradient Background**: slate-900 → purple-900 → slate-900
- **Professional Heading**: "Create Your Secure Wallet Account"
- **Description**: Information about financial management and security
- **Feature Cards** (2x2 Grid):
  1. **Secure User Registration** (Shield icon)
     - Encrypted credentials with BCrypt hashing
  2. **Group-based Access** (Users icon)
     - Role-based permissions for teams
  3. **Smart Wallet Controls** (CreditCard icon)
     - Advanced wallet management tools
  4. **Real-time Transaction System** (TrendingUp icon)
     - Instant transaction processing
- **Floating UI Elements**: Blurred background circles for depth
- **Smooth Animations**: Fade-in on page load

#### **Right Side (Signup Form)**
- **Light Gradient Background**: purple-50 → white → pink-50
- **Glassmorphism Card**: Modern frosted glass effect
- **Form Fields**:
  - Full Name (with User icon)
  - Email (with Mail icon)
  - Password (with Lock icon + show/hide toggle)
  - Confirm Password (with Key icon + show/hide toggle)
  - Account Type dropdown (with Users icon)
- **Signup Button**: Gradient blue with loading spinner
- **Login Link**: "Already have an account? Sign in now"

---

## 🔧 Technical Implementation

### **Components Used**

| Component | File | Purpose |
|-----------|------|---------|
| CommonInput | `components/common/CommonInput.jsx` | Text/email/password inputs |
| CommonSelect | `components/common/CommonSelect.jsx` | Group dropdown selector |
| CommonButton | `components/common/CommonButton.jsx` | Submit button with loading |
| CommonCard | `components/common/CommonCard.jsx` | Glassmorphism form container |
| Toast | `components/common/Toast.jsx` | Success/error notifications |

### **Validation Rules**

#### **Full Name**
- ✅ Required field
- ✅ Minimum 2 characters
- ❌ Error: "Full name is required"
- ❌ Error: "Name must be at least 2 characters"

#### **Email**
- ✅ Required field
- ✅ Valid email format (regex validation)
- ❌ Error: "Email is required"
- ❌ Error: "Please enter a valid email address"

#### **Password**
- ✅ Required field
- ✅ Minimum 6 characters
- ✅ Must contain:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
- ❌ Error: "Password is required"
- ❌ Error: "Password must be at least 6 characters"
- ❌ Error: "Password should contain uppercase, lowercase and number"

#### **Confirm Password**
- ✅ Required field
- ✅ Must match password field
- ❌ Error: "Please confirm your password"
- ❌ Error: "Passwords do not match"

#### **Account Type (Group)**
- ✅ Required field
- ✅ Must select an option
- ❌ Error: "Please select a group"

---

## 📡 API Integration

### **Endpoint**
```
POST http://localhost:8080/api/auth/signup
```

### **Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "groupId": 1
}
```

### **Success Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```

### **Error Response**
```json
{
  "timestamp": "2026-05-24T15:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already exists",
  "path": "/api/auth/signup"
}
```

---

## 🔄 Authentication Flow

1. **User fills signup form**
   - Enters name, email, password, confirm password
   - Selects account type (group)

2. **Form validation**
   - All fields validated on submit
   - Error messages displayed inline
   - Shake animation on invalid fields

3. **API call**
   - POST request to `/api/auth/signup`
   - Loading spinner shown on button
   - Form disabled during request

4. **On success**:
   - JWT token stored in `localStorage` as `wallet_token`
   - User data stored as `wallet_user`
   - Success toast: "Welcome, {name}! Your account has been created successfully."
   - Auto-redirect to `/dashboard` after 500ms

5. **On error**:
   - Error toast displayed with message
   - Form re-enabled for correction
   - User can retry

---

## 🎯 Group Options

The signup page includes a dropdown with predefined groups:

| Value | Label | Permissions |
|-------|-------|-------------|
| 1 | ADMIN - Full Access | READ, WRITE, DELETE, ADMIN |
| 2 | USER - Read Only | READ |

**Note**: In production, these should be fetched from the backend API dynamically.

---

## 📱 Responsive Design

| Device | Breakpoint | Layout |
|--------|-----------|--------|
| Mobile | < 768px | Stacked (form below branding) |
| Tablet | 768px - 1024px | 40/60 split |
| Desktop | > 1024px | 50/50 split |

### **Mobile Optimizations**
- Form scrolls vertically
- Touch-friendly inputs
- Larger tap targets
- Full-width buttons

---

## ✨ Animations & Effects

| Animation | Trigger | Description |
|-----------|---------|-------------|
| Fade-in | Page load | Branding section appears smoothly |
| Slide-up | Page load | Form card slides up |
| Shake | Validation error | Invalid fields shake |
| Hover | Mouse over | Cards and buttons scale slightly |
| Focus | Input focus | Blue ring appears |
| Loading | API call | Spinner rotates |

---

## 🔒 Security Features

1. **Password Visibility Toggle**
   - Show/hide password buttons
   - Prevents shoulder surfing

2. **Password Strength Validation**
   - Requires mixed case and numbers
   - Minimum 6 characters

3. **Email Format Validation**
   - Regex pattern matching
   - Prevents invalid emails

4. **Auto-login After Signup**
   - Seamless user experience
   - No need to login again

5. **Secure Token Storage**
   - JWT stored in localStorage
   - Attached to all API requests

---

## 🧪 Testing Instructions

### **Test Successful Signup**

1. **Start Backend**:
   ```powershell
   cd c:\Users\Dell\wallet-management-systems\wallet-management-system
   .\gradlew.bat bootRun
   ```

2. **Open Signup Page**:
   ```
   http://localhost:3001/signup
   ```

3. **Fill Form**:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `Test123`
   - Confirm Password: `Test123`
   - Account Type: `USER - Read Only`

4. **Submit**:
   - Click "Create Account"
   - Wait for loading spinner
   - Should redirect to dashboard
   - Success toast appears

### **Test Validation**

1. **Empty Fields**: Submit without filling - all errors show
2. **Invalid Email**: Enter `test@` - shows email error
3. **Weak Password**: Enter `12345` - shows password error
4. **Password Mismatch**: Different passwords - shows match error
5. **No Group**: Don't select group - shows group error

### **Test Duplicate Email**

1. Signup with same email twice
2. Second attempt should show error toast

---

## 🎨 Color Palette

### **Branding Side**
- Background: `slate-900` → `purple-900` → `slate-900`
- Accent: `purple-500`, `pink-500`, `blue-500`
- Text: White, Gray-300, Gray-400

### **Form Side**
- Background: `purple-50` → `white` → `pink-50`
- Card: White with 80% opacity
- Primary Button: `blue-600` → `blue-700` gradient
- Text: Gray-900, Gray-700, Gray-600

---

## 📂 File Structure

```
src/
├── components/common/
│   ├── CommonInput.jsx       ✅ Used
│   ├── CommonSelect.jsx      ✅ NEW - Used for group dropdown
│   ├── CommonButton.jsx      ✅ Used
│   ├── CommonCard.jsx        ✅ Used
│   └── Toast.jsx             ✅ Used
├── pages/auth/
│   ├── SignupPage.jsx        ✅ NEW - Signup page
│   ├── LoginPage.jsx         ✅ Updated - Added signup link
│   └── Dashboard.jsx
├── hooks/
│   └── useAuth.js            ✅ Updated - Added signup function
├── services/
│   └── api.js                ✅ Has signupUser function
└── App.jsx                   ✅ Updated - Added /signup route
```

---

## 🚀 Usage

### **Access Signup Page**

Direct URL:
```
http://localhost:3001/signup
```

From Login Page:
- Click "Sign up now" link at bottom of login form

### **After Signup**

- User is automatically logged in
- Redirected to dashboard
- Token and user data stored in localStorage
- Can access all protected routes

---

## 🔮 Future Enhancements

- [ ] Fetch groups from API dynamically
- [ ] Email verification after signup
- [ ] Password strength meter
- [ ] Profile picture upload
- [ ] Terms & conditions checkbox
- [ ] Social login (Google, GitHub)
- [ ] Captcha integration
- [ ] Phone number field
- [ ] Two-factor authentication setup

---

## 📞 Troubleshooting

### **Signup Fails**

**Problem**: "Email already exists"
```
Solution: Use a different email address
```

**Problem**: "Network error"
```
Solution: 
1. Ensure backend is running
2. Check API_BASE_URL in services/api.js
3. Verify CORS is enabled in backend
```

**Problem**: Form doesn't submit
```
Solution:
1. Check browser console for errors
2. Verify all fields are filled correctly
3. Check Network tab for API response
```

---

## 🎯 Key Features Summary

✅ Split-screen professional layout  
✅ Dark gradient branding section  
✅ Light gradient form section  
✅ Glassmorphism card effect  
✅ 4 feature cards with icons  
✅ 5 form fields with validation  
✅ Password show/hide toggles  
✅ Group dropdown selector  
✅ Loading spinner during API call  
✅ Success/error toast notifications  
✅ Auto-login after signup  
✅ Redirect to dashboard  
✅ Responsive design (mobile/tablet/desktop)  
✅ Smooth animations and transitions  
✅ Enterprise-level fintech UI  
✅ Reusable common components  
✅ Clean scalable code structure  

---

**Built with ❤️ using React + Tailwind CSS**
