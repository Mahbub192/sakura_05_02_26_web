# Appointments Quick Start Guide

## 🚀 Quick Access

### Frontend URLs
```
Today's:   http://localhost:4200/doctor/appointments/today
Upcoming:  http://localhost:4200/doctor/appointments/upcoming
History:   http://localhost:4200/doctor/appointments/history
```

### Backend APIs
```
Today:     GET /api/appointments/today?chamberId=1
Upcoming:  GET /api/appointments/upcoming?chamberId=1
History:   GET /api/appointments?chamberId=1&status=completed
```

---

## 📋 Three Main Views

### 1. Today's Appointments 
**When to use:** Manage today's patient flow

**Features:**
- ✅ See all today's appointments
- ✅ Change status (Scheduled → Running → Completed)
- ✅ Mark present/absent
- ✅ Real-time statistics

**Actions:**
```
Status Change → Dropdown menu
Present Toggle → Click button
Edit → Pencil icon
Cancel → Trash icon
```

---

### 2. Upcoming Appointments
**When to use:** View future appointments

**Features:**
- ✅ See all future appointments
- ✅ Grouped by date
- ✅ Card-based view
- ✅ Edit/Cancel options

**Display:**
```
📅 Tomorrow (8 appointments)
   Card 1   Card 2   Card 3
   [Edit] [Cancel]
```

---

### 3. Appointment History
**When to use:** Search past appointments, generate reports

**Features:**
- ✅ View all past appointments
- ✅ Filter by chamber, status, date range
- ✅ Search by name/phone/ID
- ✅ Export to CSV
- ✅ Revenue calculation

**Filters:**
```
Chamber: [All ▼]  Status: [All ▼]
Start: [2026-01-07]  End: [2026-02-07]
Search: [Patient name, phone, ID...]
```

---

## 🎯 Common Tasks

### Task 1: Check Today's Patients
1. Click "Today's Appointments"
2. See statistics at top
3. Scroll to see patient list

### Task 2: Mark Patient as Present
1. Go to Today's Appointments
2. Find patient in list
3. Click "○ Absent" button
4. Changes to "✓ Present"

### Task 3: Change Status
1. Find appointment in list
2. Click status dropdown
3. Select new status
4. Confirms automatically

### Task 4: View Tomorrow's Appointments
1. Click "Upcoming"
2. See appointments grouped by date
3. First group is tomorrow

### Task 5: Search Old Patient
1. Click "History"
2. Enter name/phone in search box
3. Results filter automatically

### Task 6: Export Monthly Report
1. Click "History"
2. Set Start Date: First day of month
3. Set End Date: Last day of month
4. Click "Export CSV"
5. File downloads automatically

---

## 📊 Status Workflow

```
New Patient Books
      ↓
   Scheduled (Blue)
      ↓
   Confirmed (Green) ← Call patient
      ↓
   Running (Purple) ← Patient with doctor
      ↓
   Completed (Gray) ← Visit finished
```

**Cancel anytime:** Any status → Cancelled (Red)  
**No Show:** If patient doesn't come → No Show (Yellow)

---

## 🔢 Statistics Explained

### Today's View:
- **Total:** All appointments today
- **Scheduled:** Booked but not confirmed
- **Confirmed:** Patient confirmed coming
- **Running:** Currently with doctor
- **Completed:** Finished visits
- **Cancelled:** Cancelled appointments
- **Present:** Patients who arrived

### History View:
- **Total:** All filtered appointments
- **Completed:** Successful visits
- **Cancelled:** Cancelled appointments
- **No Show:** Patients who didn't come
- **Revenue:** Total from completed visits (৳)

---

## ⚡ Keyboard Shortcuts (Planned)

```
Ctrl + T → Today's Appointments
Ctrl + U → Upcoming Appointments
Ctrl + H → History
Ctrl + R → Refresh current view
Ctrl + E → Export (in History)
```

---

## 🎨 Color Guide

### Status Colors:
- 🔵 **Blue** = Scheduled
- 🟢 **Green** = Confirmed
- 🟣 **Purple** = Running
- ⚪ **Gray** = Completed
- 🔴 **Red** = Cancelled
- 🟡 **Yellow** = No Show

### Presence:
- ✅ **Green** = Present
- ⚪ **Gray** = Absent

---

## 💡 Pro Tips

### Tip 1: Filter by Chamber
If you have multiple chambers, always filter to see specific chamber appointments.

### Tip 2: Use Date Range in History
For monthly reports, set start and end date to first and last day of month.

### Tip 3: Search is Powerful
You can search by:
- Patient name (partial match)
- Phone number
- Patient ID

### Tip 4: Export Regularly
Export history data monthly for backup and analysis.

### Tip 5: Status Updates
Update status regularly to keep accurate records:
- Mark "Confirmed" after calling patient
- Change to "Running" when patient enters
- Mark "Completed" after visit

---

## 🔍 Quick Filters

### Today's:
```
Filter: Chamber only
Sort: By serial number (automatic)
```

### Upcoming:
```
Filter: Chamber only
Sort: By date, then time (automatic)
Group: By date
```

### History:
```
Filters: Chamber, Status, Date Range, Search
Sort: By date (newest first)
```

---

## 📱 Mobile Responsive

All views are mobile-friendly:
- Tables become scrollable
- Cards stack vertically
- Filters collapse in mobile menu
- Touch-friendly buttons

---

## 🛠 Troubleshooting

### Problem: No appointments showing
**Check:**
1. Are you logged in?
2. Is chamber filter too specific?
3. Is date range correct (History)?
4. Is backend running?

### Problem: Can't change status
**Check:**
1. JWT token valid?
2. Backend server running?
3. Browser console for errors?

### Problem: Export not working
**Check:**
1. Are there appointments to export?
2. Filters not too restrictive?
3. Browser allows downloads?

---

## 🎬 Demo Workflow

### Morning Routine:
```
1. Open "Today's Appointments"
2. Check total patients for today
3. Review appointment list
4. Mark present as patients arrive
```

### During Day:
```
1. Patient arrives → Mark present
2. Patient enters → Change to "Running"
3. Visit ends → Change to "Completed"
4. Check "Upcoming" for tomorrow
```

### End of Day:
```
1. Check completed count
2. Review cancelled/no-show
3. Prepare for tomorrow (check Upcoming)
```

### Monthly:
```
1. Go to "History"
2. Set date range (full month)
3. Review statistics
4. Export CSV for records
```

---

## 📞 Quick Reference Card

| Need to... | Go to... | Action... |
|------------|----------|-----------|
| See today's patients | Today's | View list |
| Mark patient present | Today's | Click toggle |
| Start patient visit | Today's | Change status → Running |
| Finish patient visit | Today's | Change status → Completed |
| Check tomorrow | Upcoming | View first group |
| Search old patient | History | Use search box |
| Generate report | History | Set filters + Export |
| Cancel appointment | Any view | Click trash icon |

---

**এই guide bookmark করে রাখুন! সব সময় কাজে লাগবে! ⭐**

