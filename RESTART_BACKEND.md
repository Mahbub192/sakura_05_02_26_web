# Backend Restart Required - Gender Enum Fix

## সমস্যা (Problem)
Gender enum values change করা হয়েছে DTO তে, কিন্তু backend server এখনো পুরনো code দিয়ে চলছে। তাই 400 Bad Request error আসছে।

## সমাধান (Solution)
Backend server **restart** করতে হবে নতুন code load করার জন্য।

---

## Quick Steps (দ্রুত পদ্ধতি)

### Option 1: Using Terminal (সবচেয়ে সহজ)

1. **Backend terminal এ যান** (Terminal 1)
   
2. **Server stop করুন:**
   ```bash
   # Press Ctrl+C to stop the server
   ```

3. **Server আবার start করুন:**
   ```bash
   npm run start
   ```

4. **Wait করুন** যতক্ষণ না দেখেন:
   ```
   🌸 Sakura API Server is running!
   📍 API URL: http://localhost:3000/api
   ```

5. **Frontend থেকে আবার try করুন** appointment book করার জন্য

---

## Option 2: New Terminal (নতুন টার্মিনাল)

If you want to use a fresh terminal:

```bash
# Open new terminal
cd /Users/mahbub/Desktop/sakura_05-02-26/backend

# Start backend
npm run start
```

---

## Verification (যাচাই)

After restarting, test appointment booking:

1. Open **Book New Appointment** page
2. Fill all fields:
   - Chamber: Select any
   - Phone: 01705359706
   - Name: Test Patient
   - Gender: **Male** ← Important!
   - Age: 25
   - Date: Today
3. Click **Book Appointment**

**Expected Result:**
```
✅ Appointment booked successfully! Serial Number: 1
```

---

## What Changed (কি পরিবর্তন হয়েছে)

### Before Restart:
- DTO Gender enum: `'Male'`, `'Female'`, `'Other'` ❌
- Frontend sending: `'male'`, `'female'`, `'other'` ✅
- **Mismatch!** → 400 Bad Request ❌

### After Restart:
- DTO Gender enum: `'male'`, `'female'`, `'other'` ✅
- Frontend sending: `'male'`, `'female'`, `'other'` ✅
- **Match!** → Success ✅

---

## Files Changed (পরিবর্তিত ফাইল)

These files were updated, so backend needs restart:

1. `backend/src/modules/appointments/dto/create-appointment.dto.ts`
2. `backend/src/modules/patients/dto/create-patient.dto.ts`

---

## Troubleshooting (সমস্যা সমাধান)

### Issue 1: Port already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Then start again
npm run start
```

### Issue 2: TypeScript errors
```bash
# Clean build
npm run build

# Then start
npm run start
```

### Issue 3: Still getting 400 error

1. Clear browser cache
2. Hard refresh (Cmd+Shift+R on Mac)
3. Check browser console for exact error
4. Check backend terminal for validation errors

---

## Quick Command Summary

```bash
# In backend terminal (Terminal 1)
Ctrl+C              # Stop server
npm run start       # Start server

# Wait for this message:
# 🌸 Sakura API Server is running!
```

---

## After Restart Checklist

- [ ] Backend started successfully
- [ ] No errors in backend terminal
- [ ] Frontend can access API
- [ ] Gender dropdown shows: Male, Female, Other
- [ ] Can book appointment without 400 error
- [ ] Patient saved with lowercase gender in database

---

**এখন backend restart করুন এবং আবার appointment book করার চেষ্টা করুন! 🎉**

---

**Important:** প্রতিবার যখন backend code change করবেন, server restart করতে হবে। Frontend এর জন্য auto-reload আছে, কিন্তু backend এর জন্য manual restart লাগে।

