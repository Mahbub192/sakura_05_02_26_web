# Gender Enum Value Fix

## Problem (সমস্যা)

**Error Message:**
```
error: invalid input value for enum patients_gender_enum: "Male"
POST http://localhost:3000/api/appointments 500 (Internal Server Error)
```

### কারণ (Cause):
Frontend থেকে `"Male"`, `"Female"` পাঠাচ্ছিল, কিন্তু Backend database enum expect করছিল `"male"`, `"female"` (lowercase).

### মূল সমস্যা:
```typescript
// Frontend (Before) ❌
genders = ['Male', 'Female', 'Other'];

// Backend expects ✅
export enum Gender {
  MALE = 'male',      // lowercase
  FEMALE = 'female',  // lowercase
  OTHER = 'other',    // lowercase
}
```

---

## Solution (সমাধান)

### 1. Frontend Component Updated

**File:** `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.ts`

**Before:**
```typescript
genders = ['Male', 'Female', 'Other'];
```

**After:**
```typescript
genders = [
  { value: 'male', label: 'Male' },      // Send 'male' to backend, show 'Male' to user
  { value: 'female', label: 'Female' },  // Send 'female' to backend, show 'Female' to user
  { value: 'other', label: 'Other' }     // Send 'other' to backend, show 'Other' to user
];
```

### 2. Frontend Template Updated

**File:** `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.html`

**Before:**
```html
<option *ngFor="let gender of genders" [value]="gender">{{ gender }}</option>
```

**After:**
```html
<option *ngFor="let gender of genders" [value]="gender.value">{{ gender.label }}</option>
```

**Explanation:**
- `[value]="gender.value"` → Sends lowercase value to backend (`'male'`)
- `{{ gender.label }}` → Shows capitalized text to user (`'Male'`)

---

## How It Works Now

### User Perspective:
```
Dropdown shows:
┌─────────────────┐
│ Select Gender ▼ │
├─────────────────┤
│ Male            │  ← User sees "Male"
│ Female          │  ← User sees "Female"
│ Other           │  ← User sees "Other"
└─────────────────┘
```

### Backend Receives:
```json
{
  "gender": "male"    // Lowercase value
}
```

### Database Stores:
```
patients_gender_enum: 'male' ✅
```

---

## Testing

### Test Case 1: Book Appointment with Male
1. Open **Book New Appointment**
2. Fill all fields
3. Select **Gender: Male**
4. Click **Book Appointment**

**Expected Result:**
- ✅ Appointment created successfully
- ✅ Patient gender stored as `'male'` in database
- ✅ No enum error

### Test Case 2: Book Appointment with Female
1. Select **Gender: Female**
2. Submit form

**Expected Result:**
- ✅ Appointment created successfully
- ✅ Patient gender stored as `'female'` in database

### Test Case 3: Book Appointment with Other
1. Select **Gender: Other**
2. Submit form

**Expected Result:**
- ✅ Appointment created successfully
- ✅ Patient gender stored as `'other'` in database

---

## Database Schema

The PostgreSQL enum is defined as:

```sql
CREATE TYPE patients_gender_enum AS ENUM ('male', 'female', 'other');

-- Used in patients table:
CREATE TABLE patients (
  ...
  gender patients_gender_enum,
  ...
);
```

**Valid Values:** `'male'`, `'female'`, `'other'` (lowercase only)

---

## Related Files

### Frontend
- `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.ts`
  - Updated `genders` array to use value/label pairs

- `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.html`
  - Updated dropdown to bind `gender.value` and display `gender.label`

### Backend
- `backend/src/modules/patients/entities/patient.entity.ts`
  - Defines `Gender` enum with lowercase values

- `backend/src/modules/patients/dto/create-patient.dto.ts`
  - Validates gender against enum values

---

## Common Errors & Solutions

### Error 1: "invalid input value for enum"
**Cause:** Sending capitalized gender value  
**Solution:** Use lowercase values: `'male'`, `'female'`, `'other'`

### Error 2: Gender dropdown shows lowercase
**Cause:** Template displaying value instead of label  
**Solution:** Use `{{ gender.label }}` in template

### Error 3: Form validation fails
**Cause:** Enum validator expects different format  
**Solution:** Ensure DTO and entity enum match

---

## Quick Reference

| What User Sees | What Backend Gets | Database Value |
|----------------|-------------------|----------------|
| Male           | `'male'`          | `'male'`       |
| Female         | `'female'`        | `'female'`     |
| Other          | `'other'`         | `'other'`      |

---

## Summary

✅ **Fixed:** Gender enum mismatch  
✅ **Changed:** Frontend now sends lowercase values  
✅ **Maintained:** User-friendly capitalized labels  
✅ **Result:** Appointments can now be booked successfully!

## এক কথায়:
Frontend থেকে lowercase `'male'`, `'female'`, `'other'` পাঠাচ্ছে, যা backend enum এর সাথে match করে। User দেখবে capitalized "Male", "Female", "Other"। ✅

---

**Fixed Date:** Feb 7, 2026  
**Status:** ✅ Resolved

