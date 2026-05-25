# 🚀 Quick Start Guide - Wallet Management System

## Complete Setup Instructions

### Step 1: Start the Backend

```powershell
cd c:\Users\Dell\wallet-management-systems\wallet-management-system
.\gradlew.bat bootRun
```

Wait for the message: `Started WalletManagementSystemApplication in X.XXX seconds`

Backend will run on: **http://localhost:8080**

---

### Step 2: Start the Frontend

```powershell
cd c:\Users\Dell\wallet-management-systems\wallet-frontend
npm run dev
```

Frontend will open automatically on: **http://localhost:3000** (or 3001)

---

### Step 3: Create a Test User

Before logging in, you need to create a user. Use this curl command or Postman:

```powershell
curl -X POST http://localhost:8080/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "groupId": 2
  }'
```

This will return:
```json
{
  "token": "eyJhbGci...",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```

---

### Step 4: Login

1. Open the frontend in your browser
2. Enter credentials:
   - **Email**: `john@example.com`
   - **Password**: `123456`
3. Click "Sign In"
4. You'll be redirected to the Dashboard!

---

## 📋 Troubleshooting

### Backend Issues

**Problem**: Port 8080 already in use
```
Solution: Change port in wallet-management-system/src/main/resources/application.yaml
server:
  port: 8081
```

**Problem**: Database connection failed
```
Solution: 
1. Ensure PostgreSQL is running
2. Check credentials in application.yaml
3. Create database: CREATE DATABASE wallet_management_system;
```

**Problem**: Build fails
```
Solution: 
.\gradlew.bat clean build --refresh-dependencies
```

---

### Frontend Issues

**Problem**: Port 3000 already in use
```
Solution: Vite will automatically use the next available port (3001, 3002, etc.)
```

**Problem**: Cannot connect to backend
```
Solution:
1. Ensure backend is running on http://localhost:8080
2. Check browser console for CORS errors
3. Verify API_BASE_URL in src/services/api.js
```

**Problem**: Login fails
```
Solution:
1. Check if user exists in database
2. Verify email and password are correct
3. Check backend logs for errors
4. Open browser DevTools > Network tab to see API response
```

---

## 🎯 Testing Checklist

- [ ] Backend starts successfully on port 8080
- [ ] Frontend starts successfully on port 3000/3001
- [ ] Can access login page
- [ ] Can sign up a new user via API
- [ ] Can login with valid credentials
- [ ] Redirects to dashboard after login
- [ ] User data displays correctly on dashboard
- [ ] Can logout successfully
- [ ] Cannot access dashboard without login
- [ ] Error messages show for invalid credentials
- [ ] Form validation works (empty fields, invalid email)
- [ ] Loading spinner shows during login
- [ ] Toast notifications appear

---

## 📱 Access Points

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Running |
| Backend API | http://localhost:8080 | ✅ Running |
| API Health | http://localhost:8080/api/auth/login | POST endpoint |

---

## 🔑 Default Data

The backend automatically creates on first startup:

**Currencies**: INR, USD, EUR, GBP

**Account Types**: savings, business, current, wallet

**Permissions**: READ, WRITE, DELETE, ADMIN

**Groups**: 
- ADMIN (all permissions)
- USER (READ only)

---

## 💡 Tips

1. **Keep both terminal windows open** - one for backend, one for frontend
2. **Use browser DevTools** - Press F12 to debug issues
3. **Check Network tab** - See API requests and responses
4. **Check Console tab** - View JavaScript errors
5. **Clear localStorage** - Type `localStorage.clear()` in console to reset login state

---

## 🎨 Features to Try

✅ **Login Page**:
- Split-screen design with animations
- Form validation with error messages
- Show/hide password toggle
- Loading spinner during login
- Toast notifications

✅ **Dashboard**:
- User profile display
- Welcome message
- User information cards
- Logout button

✅ **Responsive Design**:
- Resize browser window to see mobile/tablet/desktop views
- Works on all screen sizes

---

## 📞 Need Help?

1. Check the [README.md](./README.md) for detailed documentation
2. Review backend logs for API errors
3. Check browser console for frontend errors
4. Verify both services are running

---

**Happy Coding! 🎉**
