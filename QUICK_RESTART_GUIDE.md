# Quick Backend Restart Guide

## ⚡ সমস্যা (Problem)
Backend server পুরনো code দিয়ে চলছে। নতুন Gender enum changes load করার জন্য restart করতে হবে।

---

## ✅ Solution (3 Simple Steps)

### Step 1: Stop Old Backend Server

**Terminal 1** (যেখানে backend চলছে) তে যান এবং:

```bash
# Press these keys together:
Ctrl + C
```

This will stop the running backend server.

---

### Step 2: Start Backend Again

Same terminal এ type করুন:

```bash
npm run start
```

---

### Step 3: Wait for Success Message

আপনি এই message দেখবেন:

```
🌸 Sakura API Server is running!

📍 API URL: http://localhost:3000/api
📚 API Docs: http://localhost:3000/api/docs
🔐 Environment: development

Press CTRL+C to stop
```

---

## 🎯 Test Appointment Booking

Backend restart হওয়ার পর:

1. **Book New Appointment** page এ যান
2. Form fill করুন:
   ```
   Chamber: [Select any chamber]
   Phone: 01705359706
   Name: Test Patient
   Gender: Male          ← Select করুন
   Age: 25
   Date: Today
   ```
3. **Book Appointment** button click করুন

### Expected Result:
```
✅ Appointment booked successfully! Serial Number: 1
```

---

## 🔧 If You See EPERM Error

If you see this error:
```
EPERM: operation not permitted, open '.env'
```

**Solution:**
```bash
# In backend terminal:
cd /Users/mahbub/Desktop/sakura_05-02-26/backend
npm run start
```

---

## 📝 What Was Fixed

### Files Changed:
1. `backend/src/modules/appointments/dto/create-appointment.dto.ts`
   - Gender enum: `'Male'` → `'male'`
   
2. `backend/src/modules/patients/dto/create-patient.dto.ts`
   - Gender enum: `'Male'` → `'male'`

### Why Restart Needed:
- NestJS needs to reload the TypeScript code
- DTO validation rules need to update
- Old enum values in memory need to be replaced

---

## 🚀 Quick Command

```bash
# Stop:  Ctrl+C
# Start: npm run start
```

---

**এখন backend restart করুন এবং appointment book করুন! কোনো 400 error হবে না! ✅**

