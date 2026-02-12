# 🎫 Appointment Slot Booking - Complete Guide

## ✅ Feature Implemented!

Book New Appointment form-এ এখন appointment slots দেখানো এবং select করার feature যুক্ত হয়েছে!

---

## 🎯 How It Works

### Workflow

```
1. Doctor selects Chamber
   ↓
2. Doctor selects Appointment Date
   ↓
3. System automatically loads available slots
   ↓
4. Doctor sees slot dropdown with:
   - Time range (09:00 - 17:00)
   - Available capacity (15/32 available)
   ↓
5. Doctor selects a slot (Optional)
   ↓
6. Fill patient details
   ↓
7. Submit
   ↓
8. System:
   - Creates appointment
   - Links to selected slot
   - Increments slot's booked patients count
   ↓
9. ✅ Success! Appointment booked with slot
```

---

## 🎨 UI Features

### Smart Slot Loading
```
✅ Auto-loads when chamber is selected
✅ Auto-reloads when date changes
✅ Shows loading indicator
✅ Filters only active slots
✅ Shows only available slots (not full)
```

### Slot Display Format
```
09:00 - 17:00 (15/32 available)
         ↑          ↑
      Time Range  Capacity
```

### User Feedback
```
✅ "Loading..." indicator while fetching
✅ "X slot(s) available" - shows count
⚠️ "No slots available. Booking without slot." - warning if none
✅ Disabled dropdown when no slots
```

---

## 📝 Fields Updated

### Backend DTO
**File:** `backend/src/modules/appointments/dto/create-appointment.dto.ts`

```typescript
@ApiProperty({ example: 1, description: 'Appointment Slot ID', required: false })
@IsNumber()
@IsOptional()
appointmentSlotId?: number;
```

### Frontend Form
**File:** `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.ts`

```typescript
appointmentForm = this.formBuilder.group({
  // ... other fields
  appointmentSlotId: [''],  // New field
  // ... other fields
});
```

---

## 🔧 Backend Logic

### Slot Validation

When booking appointment with a slot:

1. **Check Slot Exists**
   ```
   ❌ If not found → "Appointment slot not found"
   ```

2. **Check Slot is Active**
   ```
   ❌ If inactive → "This appointment slot is not active"
   ```

3. **Check Slot has Capacity**
   ```
   ❌ If full → "This appointment slot is fully booked"
   ```

4. **Increment Booked Count**
   ```
   ✅ slot.bookedPatients += 1
   ```

5. **Link Appointment to Slot**
   ```
   ✅ appointment.appointmentSlotId = slotId
   ```

### Code Implementation

**File:** `backend/src/modules/appointments/appointments.service.ts`

```typescript
// Validate and check appointment slot if provided
if (createAppointmentDto.appointmentSlotId) {
  const slot = await this.appointmentSlotsRepository.findOne({
    where: { id: createAppointmentDto.appointmentSlotId },
  });

  if (!slot) {
    throw new NotFoundException('Appointment slot not found');
  }

  if (!slot.isActive) {
    throw new BadRequestException('This appointment slot is not active');
  }

  if (slot.bookedPatients >= slot.maxPatients) {
    throw new BadRequestException('This appointment slot is fully booked');
  }

  // Increment booked patients count
  slot.bookedPatients += 1;
  await this.appointmentSlotsRepository.save(slot);
}
```

---

## 🚀 How to Use

### Step-by-Step Guide

#### 1. Go to Book Appointment
```
http://localhost:4200/doctor/appointments/new
```

#### 2. Select Chamber
```
Choose from dropdown: "Dr. Rahman Chamber - CH-001"
```

#### 3. Select Date
```
Pick a date: 2026-02-10
```

#### 4. Wait for Slots to Load
```
🔄 System automatically fetches available slots
```

#### 5. Select a Slot (Optional)
```
Dropdown shows:
✅ 09:00 - 17:00 (32/32 available)  ← Full slot
✅ 09:00 - 13:00 (15/20 available)  ← Available
```

#### 6. Fill Patient Details
```
- Phone Number
- Patient Name
- Gender
- Age
- etc.
```

#### 7. Submit
```
Click "Book Appointment"
```

#### 8. Success!
```
✅ "Appointment booked successfully! Serial Number: 5"
```

---

## 💡 Examples

### Example 1: With Slot Selection

**Scenario:** Slot available and selected

```json
POST /api/appointments
{
  "chamberId": 1,
  "appointmentSlotId": 5,  ← Slot selected
  "phone": "01710000000",
  "fullName": "Abdul Rahman",
  "identifier": "New",
  "gender": "Male",
  "age": 45,
  "appointmentDate": "2026-02-10"
}
```

**Result:**
```
✅ Appointment created
✅ Linked to slot #5
✅ Slot booked count: 15 → 16
```

### Example 2: Without Slot Selection

**Scenario:** No slot available or user didn't select

```json
POST /api/appointments
{
  "chamberId": 1,
  "appointmentSlotId": null,  ← No slot
  "phone": "01710000000",
  "fullName": "Abdul Rahman",
  "identifier": "New",
  "gender": "Male",
  "age": 45,
  "appointmentDate": "2026-02-10"
}
```

**Result:**
```
✅ Appointment created
⭕ No slot linked
✅ Regular appointment booking
```

### Example 3: Slot Full Error

**Scenario:** Selected slot is full

```json
POST /api/appointments
{
  "appointmentSlotId": 5  // This slot is full
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "This appointment slot is fully booked",
  "error": "Bad Request"
}
```

---

## 📊 Slot Capacity Management

### Real-Time Updates

```
Initial: 0/32 booked
   ↓
Booking 1: 1/32 booked
   ↓
Booking 2: 2/32 booked
   ↓
...
   ↓
Booking 32: 32/32 booked ← FULL
   ↓
Next booking attempt: ❌ Error "slot is fully booked"
```

### Display Logic

```typescript
// Frontend filters
availableSlots = response.filter((slot: any) => 
  slot.isActive && 
  slot.bookedPatients < slot.maxPatients  ← Only show if space available
);
```

---

## 🎯 Integration Points

### With Appointment Slots Feature
```
✅ Uses slots created via Slot Management
✅ Auto-generate creates slots
✅ Manual creation creates slots
✅ Booking uses these slots
```

### With Chamber Settings
```
✅ Loads slots for selected chamber
✅ Uses chamber's date availability
✅ Respects chamber's active status
```

### With Patient Management
```
✅ Links appointment to patient
✅ Creates patient if new
✅ Updates patient if existing
```

---

## 🔍 API Endpoints Used

### Get Available Slots
```
GET /api/appointment-slots/available?chamberId=1&date=2026-02-10

Response:
[
  {
    "id": 1,
    "slotDate": "2026-02-10",
    "startTime": "09:00:00",
    "endTime": "17:00:00",
    "maxPatients": 32,
    "bookedPatients": 5,
    "isActive": true
  }
]
```

### Book Appointment
```
POST /api/appointments
{
  "chamberId": 1,
  "appointmentSlotId": 1,
  "phone": "01710000000",
  ...
}

Response:
{
  "id": 10,
  "serialNumber": 6,
  "appointmentSlotId": 1,
  "chamberId": 1,
  ...
}
```

---

## ✨ Benefits

### For Doctors
```
✅ See available capacity at a glance
✅ Manage patient flow better
✅ Avoid overbooking
✅ Better time management
```

### For Patients
```
✅ Get specific time slot
✅ Know expected waiting time
✅ Better planning
✅ Reduced wait times
```

### For System
```
✅ Automatic capacity management
✅ Real-time availability tracking
✅ Data-driven scheduling
✅ Better analytics
```

---

## 🧪 Testing

### Test Scenario 1: Normal Booking

1. Login as doctor
2. Go to Book Appointment
3. Select chamber with available slots
4. Select today's date
5. See slots appear in dropdown
6. Select a slot
7. Fill patient details
8. Submit
9. ✅ Verify success message
10. ✅ Check slot booked count increased

### Test Scenario 2: No Slots Available

1. Select chamber
2. Select date with no slots
3. ⚠️ See warning: "No slots available"
4. Fill patient details anyway
5. Submit
6. ✅ Appointment created without slot

### Test Scenario 3: Slot Becomes Full

1. Create slot with maxPatients = 2
2. Book appointment #1 with slot
3. ✅ Success (1/2 booked)
4. Book appointment #2 with slot
5. ✅ Success (2/2 booked - FULL)
6. Try booking appointment #3 with same slot
7. ❌ Error: "slot is fully booked"
8. ✅ Can still book without selecting slot

---

## 📱 UI States

### Loading State
```
┌─────────────────────────────────┐
│ Appointment Slot                │
│ [Dropdown with spinner] 🔄      │
│ Loading...                      │
└─────────────────────────────────┘
```

### Available Slots
```
┌─────────────────────────────────┐
│ Appointment Slot                │
│ [09:00 - 17:00 (15/32 available)]│
│ 3 slot(s) available             │
└─────────────────────────────────┘
```

### No Slots
```
┌─────────────────────────────────┐
│ Appointment Slot                │
│ [Select Slot (Optional)]        │
│ ⚠️ No slots available.          │
│    Booking without slot.        │
└─────────────────────────────────┘
```

### Slot Selected
```
┌─────────────────────────────────┐
│ Appointment Slot                │
│ [09:00 - 17:00 (15/32 available)]│
│ 3 slot(s) available             │
└─────────────────────────────────┘
         ↓ Selected
```

---

## 🎊 Status

```
✅ Backend DTO Updated
✅ Backend Validation Implemented
✅ Backend Slot Increment Working
✅ Frontend Form Field Added
✅ Frontend Slot Loading Implemented
✅ Frontend UI Updated
✅ Integration Complete
✅ Error Handling Complete
✅ No Linter Errors
✅ Feature LIVE! 🚀
```

---

## 📚 Related Documentation

```
APPOINTMENT_SLOTS_GUIDE.md       - Slot Management feature
AUTO_GENERATE_SLOTS_GUIDE.md     - Auto-generate slots
CHAMBER_MANAGEMENT_GUIDE.md      - Chamber setup
```

---

## 🔗 Quick Links

### Slot Management
```
http://localhost:4200/doctor/appointment-slots
```

### Book Appointment
```
http://localhost:4200/doctor/appointments/new
```

### View Appointments
```
http://localhost:4200/doctor/appointments
```

---

**🌸 Sakura Appointment System**

**Appointment Slot Booking - Smart, Efficient, Real-Time! 🎫✨**

