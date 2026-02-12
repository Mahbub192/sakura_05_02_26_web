# 📅 Appointment Slot Management - Complete Guide

## 🎯 Feature Overview

Appointment Slot Management allows doctors to create time slots within their chambers where patients can book appointments. This provides better organization and prevents overbooking.

## ✨ Key Features

### Backend Features
- ✅ Create time slots with specific date, start time, and end time
- ✅ Set maximum patients per slot
- ✅ Automatic overlap detection
- ✅ Slot availability checking
- ✅ Real-time slot statistics
- ✅ Enable/Disable slots
- ✅ Prevent deletion of slots with bookings
- ✅ Auto-increment booked patients
- ✅ Soft delete support

### Frontend Features
- ✅ Beautiful slot management interface
- ✅ Create/Edit/Delete slots
- ✅ Real-time statistics dashboard
- ✅ Chamber and date filtering
- ✅ Visual status indicators
- ✅ Capacity tracking
- ✅ Responsive design

## 🔧 Backend API Endpoints

### 1. Create Appointment Slot
```http
POST /api/appointment-slots
Authorization: Bearer {token}

Request Body:
{
  "chamberId": 1,
  "slotDate": "2026-02-10",
  "startTime": "09:00:00",
  "endTime": "12:00:00",
  "maxPatients": 20,
  "notes": "Morning slot"
}

Response: 201 Created
{
  "id": 1,
  "chamberId": 1,
  "slotDate": "2026-02-10",
  "startTime": "09:00:00",
  "endTime": "12:00:00",
  "maxPatients": 20,
  "bookedPatients": 0,
  "isActive": true,
  "notes": "Morning slot",
  "createdAt": "2026-02-07T10:00:00Z"
}
```

### 2. Get All Slots (with filters)
```http
GET /api/appointment-slots?chamberId=1&date=2026-02-10&isActive=true
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "chamberId": 1,
    "chamber": { "name": "Dr. Rahman Chamber" },
    "slotDate": "2026-02-10",
    "startTime": "09:00:00",
    "endTime": "12:00:00",
    "maxPatients": 20,
    "bookedPatients": 5,
    "isActive": true,
    "notes": "Morning slot"
  }
]
```

### 3. Get Available Slots
```http
GET /api/appointment-slots/available?chamberId=1&date=2026-02-10
Authorization: Bearer {token}

Response: Only returns slots with available capacity
```

### 4. Get Slot Statistics
```http
GET /api/appointment-slots/statistics?chamberId=1&date=2026-02-10
Authorization: Bearer {token}

Response: 200 OK
{
  "date": "2026-02-10",
  "totalSlots": 3,
  "availableSlots": 2,
  "totalCapacity": 60,
  "totalBooked": 25,
  "available": 35,
  "utilizationPercentage": 41.67,
  "slots": [...]
}
```

### 5. Update Slot
```http
PUT /api/appointment-slots/:id
Authorization: Bearer {token}

Request Body:
{
  "maxPatients": 25,
  "notes": "Updated morning slot"
}
```

### 6. Toggle Slot Status
```http
PUT /api/appointment-slots/:id/toggle-status
Authorization: Bearer {token}

Response: Toggles isActive between true/false
```

### 7. Delete Slot
```http
DELETE /api/appointment-slots/:id
Authorization: Bearer {token}

Response: 200 OK (only if no bookings)
Error: 400 Bad Request if slot has bookings
```

## 🎨 Frontend Usage

### Access the Slot Management
```
URL: http://localhost:4200/doctor/appointment-slots
Login Required: Yes (Doctor role)
```

### Create a New Slot

1. Click **"Create New Slot"** button
2. Fill in the form:
   ```
   Chamber: Select chamber
   Date: 2026-02-10
   Start Time: 09:00
   End Time: 12:00
   Max Patients: 20
   Notes: Morning slot (optional)
   ```
3. Click **"Create Slot"**

### Features on the Page

#### Statistics Dashboard
Shows real-time metrics:
- **Total Slots**: Number of slots for selected date
- **Available**: Remaining capacity
- **Booked**: Number of booked appointments
- **Utilization**: Percentage of capacity used

#### Slot Table
Displays all slots with:
- **Time**: Start and end time
- **Capacity**: Maximum patients allowed
- **Booked**: Currently booked patients
- **Available**: Remaining slots
- **Status**: Active/Full/Disabled
- **Actions**: Edit/Disable/Delete buttons

#### Color Coding
- 🟢 **Green Background**: Slot has availability
- 🟡 **Yellow Background**: 80%+ capacity used
- 🔴 **Red Background**: Slot is full
- ⚫ **Gray Background**: Slot is disabled

## 💡 Smart Features

### 1. Overlap Detection
```typescript
// Backend automatically checks for overlapping time slots
// Example: Cannot create 10:00-12:00 if 09:00-11:00 exists
Error: "Time slot overlaps with existing slot"
```

### 2. Capacity Management
```typescript
// Automatically tracks booked patients
// Prevents overbooking
if (bookedPatients >= maxPatients) {
  throw new BadRequestException('Slot is full');
}
```

### 3. Protected Deletion
```typescript
// Cannot delete slots with existing bookings
if (slot.bookedPatients > 0) {
  throw new BadRequestException('Cannot delete slot with existing bookings');
}
```

## 📊 Example Use Cases

### Use Case 1: Create Morning and Evening Slots
```bash
# Morning Slot (9 AM - 12 PM)
curl -X POST http://localhost:3000/api/appointment-slots \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chamberId": 1,
    "slotDate": "2026-02-10",
    "startTime": "09:00:00",
    "endTime": "12:00:00",
    "maxPatients": 20,
    "notes": "Morning slot"
  }'

# Evening Slot (3 PM - 6 PM)
curl -X POST http://localhost:3000/api/appointment-slots \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chamberId": 1,
    "slotDate": "2026-02-10",
    "startTime": "15:00:00",
    "endTime": "18:00:00",
    "maxPatients": 15,
    "notes": "Evening slot"
  }'
```

### Use Case 2: Create Weekly Slots
```bash
# Script to create slots for entire week
for date in 2026-02-10 2026-02-11 2026-02-12 2026-02-13 2026-02-14; do
  curl -X POST http://localhost:3000/api/appointment-slots \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"chamberId\": 1,
      \"slotDate\": \"$date\",
      \"startTime\": \"09:00:00\",
      \"endTime\": \"12:00:00\",
      \"maxPatients\": 20
    }"
done
```

### Use Case 3: Get Available Slots for Booking
```bash
# Patient wants to book - show available slots
curl "http://localhost:3000/api/appointment-slots/available?chamberId=1&date=2026-02-10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔗 Integration with Appointments

### When Booking an Appointment
```typescript
// 1. Get available slots
const slots = await api.get('/appointment-slots/available', { chamberId, date });

// 2. Patient selects a slot
const selectedSlot = slots[0];

// 3. Book appointment with slotId
const appointment = await api.post('/appointments', {
  ...appointmentData,
  slotId: selectedSlot.id
});

// 4. Backend automatically increments bookedPatients
```

## 📱 Mobile Responsive

The slot management interface is fully responsive:
- ✅ Works on tablets
- ✅ Works on mobile phones
- ✅ Touch-friendly buttons
- ✅ Responsive tables
- ✅ Optimized forms

## 🎯 Best Practices

### 1. Slot Duration
```
Recommended slot durations:
- Quick consultations: 2-3 hours (09:00-11:00)
- Regular consultations: 3-4 hours (09:00-13:00)
- Full day: Split into 2 slots (Morning & Evening)
```

### 2. Patient Capacity
```
Recommended patients per slot:
- 15 minutes per patient = 12 patients for 3-hour slot
- 20 minutes per patient = 9 patients for 3-hour slot
- Add buffer: 20-25% extra (15-20 patients)
```

### 3. Slot Management
```
✅ DO:
- Create slots in advance (week ahead)
- Set realistic capacity
- Add notes for special slots
- Disable slots for holidays

❌ DON'T:
- Create overlapping slots
- Set capacity too high
- Delete slots with bookings
- Forget to enable slots
```

## 🔍 Troubleshooting

### Error: "Time slot overlaps with existing slot"
**Solution**: Check existing slots and create non-overlapping time ranges

```bash
# Check existing slots first
curl "http://localhost:3000/api/appointment-slots?chamberId=1&date=2026-02-10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Error: "Cannot delete slot with existing bookings"
**Solution**: Disable the slot instead of deleting it

```bash
# Toggle slot status (disable)
curl -X PUT "http://localhost:3000/api/appointment-slots/1/toggle-status" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Error: "Slot is full"
**Solution**: Either increase maxPatients or create a new slot

```bash
# Increase capacity
curl -X PUT "http://localhost:3000/api/appointment-slots/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"maxPatients": 30}'
```

## 📈 Analytics & Reporting

### Utilization Report
```typescript
// Get utilization for entire month
const stats = [];
for (let day = 1; day <= 30; day++) {
  const date = `2026-02-${day.toString().padStart(2, '0')}`;
  const dayStats = await api.get(`/appointment-slots/statistics?chamberId=1&date=${date}`);
  stats.push(dayStats);
}

// Calculate average utilization
const avgUtilization = stats.reduce((sum, s) => sum + s.utilizationPercentage, 0) / stats.length;
```

## 🚀 Advanced Features (Future Enhancements)

### Planned Features
- [ ] Recurring slots (weekly/monthly)
- [ ] Slot templates
- [ ] Bulk slot creation
- [ ] Waiting list when full
- [ ] SMS notifications
- [ ] Slot-specific fees
- [ ] Multi-doctor coordination
- [ ] Break time management

## 📚 Database Schema

```sql
CREATE TABLE appointment_slots (
  id SERIAL PRIMARY KEY,
  chamber_id INTEGER REFERENCES chambers(id),
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients INTEGER NOT NULL,
  booked_patients INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

-- Indexes for performance
CREATE INDEX idx_slots_chamber_date ON appointment_slots(chamber_id, slot_date);
CREATE INDEX idx_slots_active ON appointment_slots(is_active);
```

## ✅ Testing Checklist

### Backend Testing
- [ ] Create slot successfully
- [ ] Overlap detection works
- [ ] Get available slots
- [ ] Update slot capacity
- [ ] Toggle slot status
- [ ] Delete empty slot
- [ ] Prevent deletion of booked slot
- [ ] Statistics calculation

### Frontend Testing
- [ ] Page loads successfully
- [ ] Form validation works
- [ ] Create new slot
- [ ] Edit existing slot
- [ ] Delete slot
- [ ] Toggle slot status
- [ ] Statistics update
- [ ] Mobile responsive

## 🎉 Success!

Your Appointment Slot Management system is now complete with:

- ✅ **Backend APIs** - All CRUD operations
- ✅ **Frontend UI** - Beautiful management interface
- ✅ **Smart Features** - Overlap detection, capacity management
- ✅ **Real-time Stats** - Utilization tracking
- ✅ **Responsive Design** - Works on all devices

## 📞 Quick Reference

### Important URLs
```
Frontend: http://localhost:4200/doctor/appointment-slots
API Base: http://localhost:3000/api/appointment-slots
API Docs: http://localhost:3000/api/docs
```

### Quick Commands
```bash
# Create slot
POST /api/appointment-slots

# List slots
GET /api/appointment-slots?chamberId=1&date=2026-02-10

# Available slots
GET /api/appointment-slots/available?chamberId=1

# Statistics
GET /api/appointment-slots/statistics?chamberId=1

# Update slot
PUT /api/appointment-slots/:id

# Delete slot
DELETE /api/appointment-slots/:id
```

---

**Made with 🌸 Love - Sakura Appointment System**

**এখন আপনার appointment slot management system সম্পূর্ণ প্রস্তুত!** 🎉

