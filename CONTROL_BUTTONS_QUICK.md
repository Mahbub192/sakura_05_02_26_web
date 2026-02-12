# Control Buttons - Quick Reference

## 5টি Control Buttons:

### 📅 **New Appointment** (Pink)
```
→ Opens booking form
→ Route: /doctor/appointments/new
```

### 🔄 **Refresh** (Blue)
```
→ Reloads dashboard data
→ Updates patient list
→ Auto-refreshes every 30s
```

### ⏰ **Take Break** (Yellow)
```
→ Opens break modal
→ Enter break notes + duration (5-120 min)
→ Pauses auto-refresh
→ Displays on TV
→ Auto-resumes after break
```

### ➡️ **Next Patient** (Green)
```
→ Finds next waiting patient
→ Changes status to "Running"
→ Voice announcement: "Patient #X, please come"
→ Displays on TV
→ Browser notification
```

### 🧪 **Test Next** (Purple)
```
→ Finds patients needing tests
→ Voice announcement: "Patient #X, go to testing area"
→ Displays on TV
→ Browser notification
```

---

## Quick Actions:

| Button | Key Action | Result |
|--------|-----------|--------|
| New Apt | Click | Opens form |
| Refresh | Click | Reloads data |
| Break | Click → Fill modal → Start | Break mode |
| Next | Click → Confirm | Patient called |
| Test Next | Click → Confirm | Test patient called |

---

## Status Flow:

```
Scheduled → Next Patient → Running → Completed
                ↓
            Need Test → Test Next → Testing → Completed
```

---

## 🎯 Daily Workflow:

```
1. Check waiting patients
2. Click "Next Patient"
3. Patient consulted
4. Mark "Completed" or "Need Test"
5. Repeat
6. "Take Break" when needed
7. Resume after break
```

---

**That's it! Simple and efficient! 🚀**

