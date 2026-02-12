# 🔒 401 Unauthorized Error - Solution

## 🔴 সমস্যা (Problem)

```
GET http://localhost:3000/api/chambers 401 (Unauthorized)
```

## 🎯 কারণ (Cause)

আপনি **login করেননি** বা authentication token **expired** হয়ে গেছে।

## ✅ সমাধান (Solutions)

### Option 1: Login করুন (Login)

#### Step 1: Login Page এ যান
```
http://localhost:4200/auth/login
```

#### Step 2: Login করুন
```
Phone: 01900123456
Password: Test@123
```

#### Step 3: এখন Appointment Form এ যান
```
http://localhost:4200/doctor/appointments/new
```

✅ এখন chambers load হবে!

---

### Option 2: নতুন User Registration (If no account)

#### Register New Doctor:

```bash
# Terminal থেকে run করুন:
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01900123456",
    "email": "doctor@sakura.com",
    "password": "Test@123",
    "fullName": "Dr. Rahman",
    "role": "doctor"
  }'
```

তারপর login করুন।

---

## 🔧 Technical Details

### Authentication Flow:

```
1. User Login
   ↓
2. Backend returns JWT token
   ↓
3. Frontend stores token in localStorage
   ↓
4. Auth Interceptor adds token to all requests
   ↓
5. Backend validates token
   ↓
6. ✅ Access granted
```

### Why 401 Error Happens:

```
❌ No token in localStorage
❌ Token expired
❌ Token invalid
❌ Not logged in
```

---

## 🔍 Check Authentication Status

### Open Browser Console and type:

```javascript
// Check if token exists
localStorage.getItem('token')

// Should return something like:
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// If returns null:
// ❌ You're not logged in!
```

---

## ✅ Quick Fix Steps

### 1. Clear Browser Storage
```javascript
localStorage.clear()
```

### 2. Refresh Page
```
Press F5 or Ctrl+R
```

### 3. Login Again
```
Go to: http://localhost:4200/auth/login
Login with credentials
```

### 4. Test
```
Go to: http://localhost:4200/doctor/appointments/new
Should work now! ✅
```

---

## 🛡️ Auth Guard

Check if route is protected:

**File:** `src/app/modules/doctor/doctor-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: '',
    component: DoctorLayoutComponent,
    canActivate: [AuthGuard],  // ← Protected by AuthGuard
    children: [...]
  }
];
```

If you're not logged in, AuthGuard should redirect to login page.

---

## 🔑 Test Credentials

```
Phone: 01900123456
Password: Test@123
Role: Doctor
```

---

## 📝 Summary

```
Problem: 401 Unauthorized
Cause: Not logged in
Solution: Login first!

Steps:
1. Go to login page
2. Enter credentials
3. Login
4. Token stored
5. All requests authenticated ✅
```

---

**🌸 Login করুন এবং তারপর appointment form use করুন!**

