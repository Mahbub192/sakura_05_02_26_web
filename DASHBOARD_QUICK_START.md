# Dashboard Quick Start

## 🏠 Dashboard Overview

Dashboard হলো আপনার **main control center**। Login করার পর এখানেই land করবেন।

---

## 📊 What You See

### Top Section: Today's Stats (7 Cards)
```
Total | Scheduled | Confirmed | Running | Completed | Cancelled | Present
  25  |     8     |     5     |    2    |     8     |     2     |    18
```

### Middle Section: This Month (5 Cards)
```
Total | Completed | No Show | Upcoming | Revenue
 150  |    120    |    5    |    35    | ৳45,000
```

### Quick Actions (4 Buttons)
```
📋 Book Appointment   📅 Today's Queue   🕐 Manage Slots   🏥 Chambers
```

### Bottom Section: Two Widgets
```
Today's Appointments (Left)  |  Recent Activity (Right)
```

---

## 🚀 Quick Tasks

### Task 1: Check Today's Status
**Location:** Top section, first 7 cards

**What to look for:**
- **Total:** How many appointments today?
- **Present:** How many patients arrived?
- **Running:** Currently with doctor?
- **Completed:** How many finished?

### Task 2: Book New Appointment
**Action:** Click **"Book Appointment"** button

**Result:** Opens booking form

### Task 3: Manage Today's Patients
**Action:** Click **"Today's Queue"** button  
**OR** Click **"View All"** in Today's Widget

**Result:** Opens full today's management page

### Task 4: Toggle Patient Present
**Location:** Today's Appointments Widget

**Steps:**
1. Find patient in list
2. Click checkbox (✓ or ○)
3. Status toggles instantly

### Task 5: Filter by Chamber
**Location:** Top-right dropdown

**Steps:**
1. Click chamber dropdown
2. Select specific chamber
3. Dashboard reloads with filtered data

### Task 6: Refresh Data
**Location:** Top-right "Refresh" button

**Action:** Click to manually refresh  
**Note:** Also auto-refreshes every 30 seconds

---

## 🎨 Color Guide

### Status Colors:
- 🔵 **Blue** = Scheduled (waiting)
- 🟢 **Green** = Confirmed (ready)
- 🟣 **Purple** = Running (active)
- ⚪ **Gray** = Completed (done)
- 🔴 **Red** = Cancelled
- 🟡 **Yellow** = No Show

### Card Colors:
- **White cards** = Today's stats
- **Gradient cards** = Month stats (more visual)
- **Bordered cards** = Quick actions (hover changes color)

---

## 📱 Navigation

### From Dashboard, You Can Go To:
```
Book Appointment → /doctor/appointments/new
Today's Queue → /doctor/appointments/today
Manage Slots → /doctor/appointment-slots
Chambers → /doctor/chambers
Upcoming → /doctor/appointments/upcoming (click Upcoming card)
History → /doctor/appointments/history (click "View History")
```

### Quick Clicks:
- **Total Card** → Today's Appointments
- **Upcoming Card** → Upcoming Appointments
- **View All (Today)** → Today's Appointments
- **View History** → Appointment History

---

## ⏱ Auto-Refresh

Dashboard automatically updates every **30 seconds**:
- ✅ No need to refresh manually
- ✅ Always shows current data
- ✅ Smooth updates (no page reload)

**Manual Refresh:** Click "Refresh" button anytime

---

## 🔍 What Each Stat Means

### Today's Stats:
| Stat | Meaning | What to Do |
|------|---------|------------|
| **Total** | All appointments today | View overall load |
| **Scheduled** | Booked but not confirmed | Call to confirm |
| **Confirmed** | Patient confirmed coming | Ready to see |
| **Running** | Currently with doctor | Active consultation |
| **Completed** | Visit finished | Archive/billing |
| **Cancelled** | Appointment cancelled | Follow-up needed |
| **Present** | Patients who arrived | Physical attendance |

### Month Stats:
| Stat | Meaning | Action |
|------|---------|--------|
| **Total** | All month appointments | Monthly overview |
| **Completed** | Successful visits | Performance metric |
| **No Show** | Didn't arrive | Follow-up calls |
| **Upcoming** | Future appointments | Planning |
| **Revenue** | Total earnings | Financial tracking |

---

## 💡 Pro Tips

### Tip 1: Morning Routine
```
1. Check "Total" today → See workload
2. Check "Present" → See who arrived
3. Use Today's Widget → Quick status updates
```

### Tip 2: Filter by Chamber
```
If multiple chambers:
→ Filter to see specific chamber data
→ Better focus and management
```

### Tip 3: Quick Actions
```
Most used buttons on dashboard:
1. Book Appointment (most frequent)
2. Today's Queue (multiple times per day)
3. Manage Slots (once per day/week)
```

### Tip 4: Widget Usage
```
Today's Widget → Quick present toggle
Recent Activity → Check last patient status
```

### Tip 5: Revenue Tracking
```
Month Revenue card shows:
→ Only completed appointments counted
→ Real-time calculation
→ Accurate financial overview
```

---

## 🎯 Common Workflows

### Morning Start:
```
1. Open Dashboard
2. Check Total appointments
3. Review Today's Widget
4. Mark early arrivals as Present
5. Open Today's Queue for full view
```

### During Day:
```
1. Dashboard auto-refreshes
2. Quick check statistics
3. Toggle present as patients arrive
4. Use Quick Actions for tasks
```

### End of Day:
```
1. Check Completed count
2. Review Cancelled/No Show
3. Check Upcoming for tomorrow
4. Review Month Revenue
```

---

## 📊 Statistics Summary

### Always Visible:
- ✅ Today's 7 statistics
- ✅ Month's 5 statistics
- ✅ First 10 today's appointments
- ✅ Last 5 recent activities

### Updates:
- ✅ Every 30 seconds automatically
- ✅ On manual refresh
- ✅ On chamber filter change

---

## 🚨 Troubleshooting

### Issue: Statistics Not Loading
**Solution:**
1. Check if backend is running
2. Check login status (401 error?)
3. Click Refresh button
4. Check browser console

### Issue: Wrong Numbers
**Solution:**
1. Check chamber filter
2. Click "All Chambers" to see total
3. Wait for auto-refresh

### Issue: Today's Widget Empty
**Reason:** No appointments scheduled for today
**Solution:** Book appointments or check upcoming

### Issue: Can't Toggle Present
**Solution:**
1. Refresh page
2. Check login token
3. Check backend console

---

## ⌨️ Keyboard Navigation (Future)

```
Ctrl + D → Dashboard (from anywhere)
Ctrl + R → Refresh Dashboard
Ctrl + B → Book Appointment
Ctrl + T → Today's Queue
```

---

## 📝 Quick Reference Card

| Need to... | Look at... | Click... |
|------------|------------|----------|
| Check today's total | Top stat cards | Total card |
| See who's present | Today's stats | Present card |
| Book appointment | Quick Actions | Book button |
| Manage today | Quick Actions | Today's Queue |
| Toggle present | Today's Widget | Checkbox |
| See recent | Recent Widget | View History |
| Filter data | Top-right | Chamber dropdown |
| Refresh | Top-right | Refresh button |

---

## 🎬 5-Second Dashboard Check

```
1. Total → See workload
2. Present → See attendance  
3. Running → See active
4. Revenue → See earnings
```

**That's it! Dashboard at a glance in 5 seconds!**

---

**Dashboard হলো আপনার command center। এখান থেকে সব control করুন! 🎯**

**Bookmark this guide for quick reference! ⭐**

