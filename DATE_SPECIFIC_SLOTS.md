# Date-Specific Appointment Slots Feature

## বাংলায় সংক্ষেপ (Bangla Summary)
**Book New Appointment** page-এ এখন যে date select করবেন, ঠিক সেই date-এর appointment slots দেখাবে।

## Feature Overview
The appointment booking form now dynamically loads and displays appointment slots based on the selected date.

## How It Works

### 1. Frontend Implementation

#### Date Selection & Auto-Loading
When user selects a date in the appointment form, slots are automatically loaded:

**Location:** `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.ts`

```typescript
// Listen for date changes
this.appointmentForm.get('appointmentDate')?.valueChanges.subscribe(() => {
  this.loadAvailableSlots();
});
```

#### Loading Slots by Date
```typescript
loadAvailableSlots(): void {
  const chamberId = this.appointmentForm.get('chamberId')?.value;
  const appointmentDate = this.appointmentForm.get('appointmentDate')?.value;

  if (!chamberId || !appointmentDate) {
    this.availableSlots = [];
    return;
  }

  this.loadingSlots = true;
  
  // Load slots for specific chamber and date
  this.apiService.get(`/appointment-slots/available?chamberId=${chamberId}&date=${appointmentDate}`)
    .subscribe({
      next: (response: any) => {
        this.availableSlots = response.filter((slot: any) => slot.isActive)
          .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
        this.loadingSlots = false;
      },
      error: (error) => {
        console.error('Error loading slots:', error);
        this.availableSlots = [];
        this.loadingSlots = false;
      }
    });
}
```

### 2. Backend Implementation

#### API Endpoint
**Endpoint:** `GET /api/appointment-slots/available`

**Query Parameters:**
- `chamberId` (required): Chamber ID to filter slots
- `date` (optional): Specific date to filter slots (format: YYYY-MM-DD)

**Example Request:**
```
GET /api/appointment-slots/available?chamberId=1&date=2026-02-07
```

#### Service Logic
**Location:** `backend/src/modules/appointment-slots/appointment-slots.service.ts`

```typescript
async findAvailableSlots(chamberId: number, date?: string) {
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const whereClause: any = {
    chamberId,
    isActive: true,
  };

  if (date) {
    // Exact date match - returns slots for ONLY the selected date
    whereClause.slotDate = targetDate;
  } else {
    // Future dates only - returns all upcoming slots
    whereClause.slotDate = MoreThanOrEqual(targetDate);
  }

  const slots = await this.slotsRepository.find({
    where: whereClause,
    relations: ['chamber'],
    order: { slotDate: 'ASC', startTime: 'ASC' },
  });

  // Filter slots that still have capacity
  return slots.filter(slot => slot.bookedPatients < slot.maxPatients);
}
```

### 3. User Experience

#### Workflow
1. **Open Book New Appointment page**
   - Default date is set to today

2. **Select Chamber**
   - Slots load automatically for today's date

3. **Change Date**
   - User selects a different date from date picker
   - Slots automatically reload for the new date
   - Only slots for that specific date are shown

4. **View Available Slots**
   - Slots are displayed as colored buttons
   - Green: Available slots
   - Orange: Nearly full (80%+ capacity)
   - Red: Full/unavailable
   - Gray: No capacity

5. **Select Time**
   - Click on a slot to see individual 15-minute time buttons
   - Select specific time from the generated slots

#### Visual Indicators
```
Loading State:
┌────────────────────────────────────┐
│  Loading available slots...        │
└────────────────────────────────────┘

No Slots Available:
┌────────────────────────────────────┐
│  No slots available for this date  │
└────────────────────────────────────┘

Available Slots (Example):
┌──────────┬──────────┬──────────┐
│ 09:00 AM │ 10:00 AM │ 11:00 AM │
│ (5/10)   │ (2/10)   │ (0/10)   │
│  Green   │  Green   │   Red    │
└──────────┴──────────┴──────────┘
```

## Testing Guide

### Test Scenario 1: Today's Slots
1. Navigate to **Book New Appointment**
2. Select a chamber
3. Date should be today by default
4. Verify that slots for today are displayed

### Test Scenario 2: Future Date
1. Change date to tomorrow
2. Verify that slots for tomorrow are displayed
3. Verify that today's slots are not shown

### Test Scenario 3: Past Date
1. Try to select a past date
2. Date picker should prevent selection (if configured)
3. Or show "No slots available" message

### Test Scenario 4: No Slots
1. Select a date with no slots created
2. Should show "No slots available for this date"

### Test Scenario 5: Fully Booked
1. Select a date where all slots are fully booked
2. Should show "No slots available for this date"

## Benefits

### 1. Improved User Experience
- ✅ Automatic loading on date change
- ✅ Only relevant slots displayed
- ✅ No manual refresh needed
- ✅ Clear visual feedback

### 2. Better Performance
- ✅ Loads only necessary data
- ✅ Reduces server load
- ✅ Faster response times

### 3. Accurate Information
- ✅ Shows exact availability for selected date
- ✅ Real-time capacity information
- ✅ Prevents confusion with multiple dates

## Related Features

### Chamber Selection
Changing chamber also triggers slot reload for current date

### Slot Capacity
Each slot shows:
- Current bookings / Maximum capacity
- Color-coded availability status

### Time Selection
After selecting a slot, individual 15-minute time buttons are generated

## Troubleshooting

### Issue: Slots not loading
**Solution:**
1. Check if chamber is selected
2. Verify date is selected
3. Check browser console for errors
4. Ensure backend is running

### Issue: Wrong slots displayed
**Solution:**
1. Clear browser cache
2. Verify backend date filtering logic
3. Check timezone settings

### Issue: No slots for future dates
**Solution:**
1. Create slots for those dates first
2. Go to **Appointment Slot Management**
3. Use **Auto-Generate** feature

## Quick Reference

### API Endpoint
```
GET /api/appointment-slots/available?chamberId={id}&date={YYYY-MM-DD}
```

### Response Format
```json
[
  {
    "id": 1,
    "chamberId": 1,
    "slotDate": "2026-02-07",
    "startTime": "09:00:00",
    "endTime": "10:00:00",
    "maxPatients": 10,
    "bookedPatients": 5,
    "isActive": true,
    "chamber": {
      "id": 1,
      "name": "Main Chamber"
    }
  }
]
```

## Files Modified

### Frontend
- `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.ts`
  - Added date change listener
  - Implemented `loadAvailableSlots()` method

- `src/app/modules/doctor/pages/appointments/appointment-form/appointment-form.component.html`
  - Display slots as buttons
  - Show loading and empty states

### Backend
- `backend/src/modules/appointment-slots/appointment-slots.service.ts`
  - Updated `findAvailableSlots()` for exact date matching
  - Added conditional date filtering

- `backend/src/modules/appointment-slots/appointment-slots.controller.ts`
  - `/available` endpoint with date query parameter

---

## Summary
এখন **Book New Appointment** page-এ যে date select করবেন, শুধুমাত্র সেই date-এর slots দেখাবে। Automatic loading এবং color-coded display সহ সম্পূর্ণ functional!

