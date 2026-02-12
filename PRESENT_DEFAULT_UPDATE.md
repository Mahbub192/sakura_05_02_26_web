# Appointment Present Status - Default Update

## 📝 Change Summary

Updated the default value of `isPresent` field in appointments from `false` to `true`.

### **Reason:**
Initially, all patients should be marked as **Present** when their appointment is created. The doctor can then manually change them to **Absent** if needed.

---

## 🔧 Changes Made:

### **1. Backend Entity Update**
**File:** `backend/src/modules/appointments/entities/appointment.entity.ts`

**Before:**
```typescript
@Column({ name: 'is_present', default: false })
isPresent: boolean;
```

**After:**
```typescript
@Column({ name: 'is_present', default: true })
isPresent: boolean;
```

---

## 📊 Database Update

If you have existing appointments in the database, run the SQL script:

```bash
cd backend
psql -U your_username -d your_database -f UPDATE_PRESENT_DEFAULT.sql
```

Or manually run:
```sql
UPDATE appointments 
SET is_present = true 
WHERE is_present = false OR is_present IS NULL;
```

---

## 🎯 Behavior:

### **Before:**
- New appointments: `isPresent = false` (Absent)
- Doctor had to manually mark as Present ❌

### **After:**
- New appointments: `isPresent = true` (Present) ✅
- Doctor can mark as Absent if needed ✓

---

## 🖥️ Frontend Display:

### **Dashboard Patient List:**

| Present Status | Button Color | Label | Action |
|----------------|--------------|-------|--------|
| `true` (default) | 🟢 Green | ✓ Present | Click to mark Absent |
| `false` | ⚪ Gray | ○ Absent | Click to mark Present |

---

## ✅ Testing:

### **Step 1: Create New Appointment**
```
1. Go to: Book New Appointment
2. Fill form and submit
3. Check Dashboard → Patient should show "✓ Present" (green)
```

### **Step 2: Toggle to Absent**
```
1. Click "✓ Present" button
2. Should change to "○ Absent" (gray)
3. Status may change to "Absent"
```

### **Step 3: Toggle back to Present**
```
1. Click "○ Absent" button
2. Should change back to "✓ Present" (green)
3. Status may change back to "Serialized"
```

---

## 🔄 API Behavior:

### **Create Appointment:**
```json
POST /api/appointments
{
  "chamberId": 1,
  "patientId": 123,
  // ... other fields
  // isPresent will default to true automatically
}
```

### **Toggle Present:**
```json
PUT /api/appointments/:id/toggle-present
// Toggles isPresent value and updates status accordingly
```

---

## 📋 Files Modified:

1. ✅ `backend/src/modules/appointments/entities/appointment.entity.ts`
2. ✅ `backend/UPDATE_PRESENT_DEFAULT.sql` (created)
3. ✅ `PRESENT_DEFAULT_UPDATE.md` (this file)

---

## 🚀 Deployment Notes:

When deploying to production:

1. **Backup database** first
2. **Run SQL update** script for existing appointments
3. **Restart backend** server to apply entity changes
4. **Test** with a new appointment
5. **Verify** existing appointments show as Present

---

## 💡 Future Enhancements:

- Auto-mark as Absent if patient doesn't arrive within X minutes
- Bulk Present/Absent toggle
- SMS notification when marked Absent
- Present/Absent history tracking

---

**Updated:** February 7, 2026  
**Status:** ✅ Implemented

