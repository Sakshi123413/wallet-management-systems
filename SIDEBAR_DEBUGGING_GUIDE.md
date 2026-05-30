# Role-Based Sidebar Debugging Guide

## Root Cause Analysis

### **The Problem:**
After implementing role-based visibility, ADMIN users could only see the Dashboard module instead of all modules.

### **Root Cause:**
The issue was caused by **missing `groupName` data** in existing user sessions that were created before the role-based visibility feature was implemented.

### **Data Flow:**

```
Backend Login Response
    ↓
{ token, userId, email, name, groupName }  ← groupName added recently
    ↓
Frontend stores in localStorage
    ↓
{ user: { userId, email, name, groupName } }
    ↓
Sidebar reads user from localStorage
    ↓
isAdmin(user) checks user.groupName === 'ADMIN'
    ↓
If groupName is missing/null/undefined → returns false → Shows only Dashboard
```

---

## Fixes Applied

### **1. Case-Insensitive Comparison** ✅

**File:** `wallet-frontend/src/utils/helpers.js`

**Before:**
```javascript
export const isAdmin = (user) => {
  if (!user) return false;
  return user.groupName === 'ADMIN';  // Case-sensitive
};
```

**After:**
```javascript
export const isAdmin = (user) => {
  if (!user) {
    console.warn('[isAdmin] User object is null or undefined');
    return false;
  }
  
  console.log('[isAdmin] Checking admin status:', {
    user: user,
    groupName: user.groupName,
    groupNameType: typeof user.groupName,
    isAdmin: user.groupName === 'ADMIN'
  });
  
  // Case-insensitive comparison for safety
  return user.groupName && user.groupName.toUpperCase() === 'ADMIN';
};
```

**Why:** Handles potential case variations ("ADMIN", "Admin", "admin")

---

### **2. Comprehensive Debug Logging** ✅

**Added logging at 3 critical points:**

#### **A. Login Hook (useAuth.js)**
```javascript
console.log('[Login] Backend response:', {
  userId: response.userId,
  email: response.email,
  name: response.name,
  groupName: response.groupName  // ← Verify backend sends this
});

console.log('[Login] Stored user data in localStorage:', {
  userId: response.userId,
  groupName: response.groupName  // ← Verify storage
});
```

#### **B. Sidebar Component (Sidebar.jsx)**
```javascript
console.log('[Sidebar] User data from localStorage:', user);
console.log('[Sidebar] User group name:', user?.groupName);

const isAdminUser = isAdmin(user);
console.log('[Sidebar] Is admin?', isAdminUser);
console.log('[Sidebar] Menu items count:', isAdminUser ? allMenuItems.length : defaultMenuItems.length);
```

#### **C. Admin Check Helper (helpers.js)**
```javascript
console.log('[isAdmin] Checking admin status:', {
  user: user,
  groupName: user.groupName,
  groupNameType: typeof user.groupName,
  isAdmin: user.groupName === 'ADMIN'
});
```

#### **D. Backend Service (AuthServiceImpl.java)**
```java
String groupName = user.getGroup() != null ? user.getGroup().getName() : "USER";
log.info("User login successful: email={}, userId={}, groupName={}", 
    request.getEmail(), user.getId(), groupName);
```

---

## Testing Instructions

### **Step 1: Clear Old Session Data**

**IMPORTANT:** Existing sessions don't have `groupName` field!

1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Clear all data:
   ```javascript
   localStorage.clear()
   ```
4. Or manually delete:
   - `authToken`
   - `user`

### **Step 2: Restart Backend**

```powershell
cd wallet-management-system
.\gradlew bootRun
```

### **Step 3: Login as ADMIN**

1. Navigate to login page
2. Login with ADMIN credentials
3. **Open browser console (F12 → Console tab)**

### **Step 4: Check Console Logs**

You should see these logs in order:

```javascript
// 1. Login response from backend
[Login] Backend response: {
  userId: 1,
  email: "admin@example.com",
  name: "Admin User",
  groupName: "ADMIN"  ← MUST be "ADMIN"
}

// 2. Data stored in localStorage
[Login] Stored user data in localStorage: {
  userId: 1,
  groupName: "ADMIN"  ← MUST be "ADMIN"
}

// 3. Sidebar reads user data
[Sidebar] User data from localStorage: {
  userId: 1,
  email: "admin@example.com",
  name: "Admin User",
  groupName: "ADMIN"  ← MUST be "ADMIN"
}

[Sidebar] User group name: "ADMIN"

// 4. Admin check
[isAdmin] Checking admin status: {
  user: { userId: 1, email: "...", name: "...", groupName: "ADMIN" },
  groupName: "ADMIN",
  groupNameType: "string",
  isAdmin: true  ← MUST be true
}

// 5. Sidebar decision
[Sidebar] Is admin? true  ← MUST be true
[Sidebar] Menu items count: 8  ← MUST be 8 (all modules)
```

### **Step 5: Verify Sidebar**

**Expected for ADMIN:**
```
Sidebar shows:
├─ Dashboard ✅
├─ Users ✅
├─ Groups ✅
├─ Permissions ✅
├─ Accounts ✅
├─ Account Types ✅
├─ Currencies ✅
└─ Settings ✅
```

---

## Troubleshooting

### **Issue 1: groupName is `undefined` or `null`**

**Console shows:**
```javascript
[Login] Backend response: {
  userId: 1,
  groupName: undefined  // ← PROBLEM
}
```

**Cause:** Backend not sending groupName in response

**Solution:**
1. Check backend logs for:
   ```
   User login successful: email=..., userId=..., groupName=ADMIN
   ```
2. Verify `LoginResponse.java` has `groupName` field
3. Verify `AuthServiceImpl.java` returns groupName
4. Restart backend

---

### **Issue 2: groupName exists but isAdmin returns false**

**Console shows:**
```javascript
[isAdmin] Checking admin status: {
  groupName: "ADMIN",
  groupNameType: "string",
  isAdmin: false  // ← PROBLEM
}
```

**Cause:** Case mismatch or whitespace

**Solution:**
1. Check exact value:
   ```javascript
   console.log('Group name:', JSON.stringify(user.groupName));
   // Look for: "ADMIN" vs "Admin" vs "admin" vs " ADMIN "
   ```
2. The fix already handles this with `.toUpperCase()`
3. If still failing, check for hidden characters

---

### **Issue 3: Old localStorage data without groupName**

**Console shows:**
```javascript
[Sidebar] User data from localStorage: {
  userId: 1,
  email: "admin@example.com",
  name: "Admin User"
  // groupName field is MISSING ← PROBLEM
}
```

**Cause:** User logged in BEFORE role-based visibility was implemented

**Solution:**
1. **Logout**
2. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   ```
3. **Login again** (this will store new data with groupName)

---

### **Issue 4: Backend returns groupName as "USER" for admin**

**Backend logs show:**
```
User login successful: email=admin@example.com, userId=1, groupName=USER
```

**Cause:** User's group_id is NULL or points to wrong group

**Solution:**
1. Check database:
   ```sql
   SELECT u.id, u.email, u.group_id, g.name 
   FROM users u 
   LEFT JOIN groups g ON u.group_id = g.id 
   WHERE u.email = 'admin@example.com';
   ```
   
2. Expected result:
   ```
   id | email              | group_id | name
   1  | admin@example.com  | 1        | ADMIN
   ```
   
3. If group_id is NULL, update it:
   ```sql
   UPDATE users 
   SET group_id = (SELECT id FROM groups WHERE name = 'ADMIN') 
   WHERE email = 'admin@example.com';
   ```

---

### **Issue 5: Case mismatch in group name**

**Database has:**
```
groups.name = "Admin"  // Not "ADMIN"
```

**Solution:**
1. Update database to use uppercase:
   ```sql
   UPDATE groups SET name = 'ADMIN' WHERE name = 'Admin';
   UPDATE groups SET name = 'USER' WHERE name = 'User';
   ```
   
2. Or rely on the case-insensitive comparison (already implemented):
   ```javascript
   return user.groupName && user.groupName.toUpperCase() === 'ADMIN';
   ```

---

## Quick Fix Checklist

If ADMIN can only see Dashboard:

- [ ] 1. **Clear localStorage:** `localStorage.clear()`
- [ ] 2. **Logout and login again**
- [ ] 3. **Check browser console** for debug logs
- [ ] 4. **Verify `groupName` is "ADMIN"** in console logs
- [ ] 5. **Check backend logs** for groupName value
- [ ] 6. **Verify database** has correct group_id for admin user
- [ ] 7. **Restart backend** if needed

---

## Expected Console Output (ADMIN User)

```
[Login] Backend response: {userId: 1, email: "admin@example.com", name: "Admin User", groupName: "ADMIN"}
[Login] Stored user data in localStorage: {userId: 1, groupName: "ADMIN"}
[Sidebar] User data from localStorage: {userId: 1, email: "admin@example.com", name: "Admin User", groupName: "ADMIN"}
[Sidebar] User group name: "ADMIN"
[isAdmin] Checking admin status: {user: {...}, groupName: "ADMIN", groupNameType: "string", isAdmin: true}
[Sidebar] Is admin? true
[Sidebar] Menu items count: 8
```

---

## Expected Console Output (Non-ADMIN User)

```
[Login] Backend response: {userId: 2, email: "user@example.com", name: "Regular User", groupName: "USER"}
[Login] Stored user data in localStorage: {userId: 2, groupName: "USER"}
[Sidebar] User data from localStorage: {userId: 2, email: "user@example.com", name: "Regular User", groupName: "USER"}
[Sidebar] User group name: "USER"
[isAdmin] Checking admin status: {user: {...}, groupName: "USER", groupNameType: "string", isAdmin: false}
[Sidebar] Is admin? false
[Sidebar] Menu items count: 1
```

---

## Summary

**Root Cause:** Missing `groupName` in existing localStorage sessions

**Fix:** 
1. Case-insensitive comparison
2. Comprehensive debug logging
3. Clear old session data and re-login

**Verification:** Check console logs to see exact `groupName` value being used

**Result:** ADMIN users see all 8 modules, non-ADMIN users see only Dashboard
