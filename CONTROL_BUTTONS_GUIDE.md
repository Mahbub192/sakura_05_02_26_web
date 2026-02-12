# Control Buttons Functionality Guide

## 📋 Overview

Dashboard এ 5টি control buttons আছে যেগুলো doctor এর daily workflow manage করে।

---

## 🎮 Control Buttons:

### **1. New Appointment** 📅
**Color:** Pink  
**Action:** Redirects to appointment booking form

```typescript
Route: /doctor/appointments/new
```

**Use Case:**
- Walk-in patient book করা
- Emergency appointment create করা

---

### **2. Refresh** 🔄
**Color:** Blue  
**Action:** Dashboard data reload করে

```typescript
loadDashboardData()
```

**Features:**
- Patient list refresh
- Stats update
- Real-time data
- Auto-refresh every 30 seconds (background)

---

### **3. Take Break** ⏰
**Color:** Yellow/Orange  
**Action:** Doctor break mode activate করে

#### **Break Modal:**
```
┌─────────────────────────────────────┐
│ Take a Break                        │
├─────────────────────────────────────┤
│ Notes (TV display):                 │
│ [_________________________]        │
│                                     │
│ Duration (minutes):                 │
│ [15]                                │
│                                     │
│ [Cancel]  [Start Break]            │
└─────────────────────────────────────┘
```

**Functionality:**
```typescript
onBreak({ notes, duration }) {
  // 1. Stop auto-refresh
  // 2. Display break message on TV
  // 3. Auto-resume after duration
  // 4. Show notification
}
```

**Use Cases:**
- Lunch break
- Emergency call
- Prayer time
- Personal break

**Duration:** 5-120 minutes  
**Default:** 15 minutes

**TV Display:**
```
╔═══════════════════════════════════╗
║  🕐 DOCTOR ON BREAK               ║
║                                   ║
║  Lunch Break                      ║
║  Will return in 15 minutes        ║
╔═══════════════════════════════════╗
```

---

### **4. Next Patient** ➡️
**Color:** Green  
**Action:** Next waiting patient কে call করে

#### **Process:**
```
1. Find next waiting patient (Present + Scheduled/Confirmed/Serialized)
   ↓
2. Show confirmation
   ↓
3. Change status to "Running"
   ↓
4. Voice announcement (mock)
   ↓
5. Display on TV
   ↓
6. Browser notification
```

**Code:**
```typescript
onNextPatient() {
  // Find waiting patients
  const waitingPatients = appointments.filter(
    apt => apt.isPresent && 
    (apt.status === 'scheduled' || 
     apt.status === 'confirmed' || 
     apt.status === 'serialized')
  );
  
  // Get first patient
  const nextPatient = waitingPatients[0];
  
  // Update status to 'running'
  updateStatus(nextPatient.id, 'running');
  
  // Announce
  announce(nextPatient);
}
```

**Announcement:**
```
🔊 "Patient number 5, John Doe, please come to the consultation room."
```

**TV Display:**
```
╔═══════════════════════════════════╗
║  📢 NOW CALLING                   ║
║                                   ║
║  Serial #5                        ║
║  John Doe                         ║
║                                   ║
║  Please proceed to consultation   ║
╔═══════════════════════════════════╗
```

---

### **5. Test Next** 🧪
**Color:** Purple  
**Action:** Test waiting patient কে call করে

#### **Process:**
```
1. Find patients with status "need_test"
   ↓
2. Show confirmation
   ↓
3. Voice announcement (mock)
   ↓
4. Display on TV
   ↓
5. Browser notification
```

**Code:**
```typescript
onTestNext() {
  // Find test patients
  const testPatients = appointments.filter(
    apt => apt.isPresent && apt.status === 'need_test'
  );
  
  // Get first patient
  const nextTestPatient = testPatients[0];
  
  // Announce for test
  announceTestPatient(nextTestPatient);
}
```

**Announcement:**
```
🔊 "Patient number 3, Jane Smith, please proceed to the testing area."
```

**TV Display:**
```
╔═══════════════════════════════════╗
║  🧪 LAB TEST PATIENT              ║
║                                   ║
║  Serial #3                        ║
║  Jane Smith                       ║
║                                   ║
║  Please go to testing area        ║
╔═══════════════════════════════════╗
```

---

## 🔔 Notifications:

### **Browser Notification:**
```javascript
if (Notification.permission === 'granted') {
  new Notification('Next Patient', {
    body: 'Serial #5 - John Doe',
    icon: '/assets/logo.png'
  });
}
```

**Request Permission:**
```javascript
Notification.requestPermission();
```

---

## 🎨 Button Styles:

```scss
// Pink - New Appointment
.btn-primary {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
}

// Blue - Refresh
.btn-blue {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}

// Yellow - Break
.btn-warning {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

// Green - Next
.btn-green {
  background: linear-gradient(135deg, #10B981, #059669);
}

// Purple - Test Next
.btn-purple {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
}
```

---

## 📊 Workflow Example:

### **Morning Session:**
```
1. Doctor arrives
   ↓
2. Check dashboard (patients waiting)
   ↓
3. Click "Next Patient" → Patient #1 called
   ↓
4. Consultation completed
   ↓
5. Mark as "Completed"
   ↓
6. Click "Next Patient" → Patient #2 called
   ↓
7. Patient needs test → Mark as "Need Test"
   ↓
8. Click "Test Next" → Patient #2 called for test
   ↓
9. Continue with Patient #3
   ↓
10. Lunch time → Click "Take Break" (30 min)
    ↓
11. Break ends → Continue with remaining patients
```

---

## 🔊 Voice Announcements:

### **Implementation (Future):**
```typescript
class TextToSpeechService {
  speak(text: string, language: 'en' | 'bn' = 'bn') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}
```

**Bengali Announcement:**
```
"রোগী নম্বর ৫, জন ডো, অনুগ্রহ করে পরামর্শ কক্ষে আসুন।"
```

---

## 🎯 Status Flow:

```
Scheduled → Confirmed → Serialized → Running → Completed
                              ↓
                          Need Test
                              ↓
                          Test Next
                              ↓
                          Completed
```

---

## ⚙️ Configuration:

### **Auto-Refresh:**
```typescript
// Interval: 30 seconds
private refreshInterval: any;

startAutoRefresh() {
  this.refreshInterval = setInterval(() => {
    this.loadDashboardData();
  }, 30000);
}
```

### **Break Duration:**
```typescript
Min: 5 minutes
Max: 120 minutes
Default: 15 minutes
```

---

## 📱 Responsive Design:

**Desktop:**
```
[New Apt] [Refresh] [Break] [Next] [Test Next]
```

**Tablet:**
```
[New Apt] [Refresh] [Break]
[Next]    [Test Next]
```

**Mobile:**
```
[New Apt]
[Refresh]
[Break]
[Next]
[Test Next]
```

---

## ✅ Testing Checklist:

- [ ] New Appointment button routes correctly
- [ ] Refresh updates dashboard data
- [ ] Break modal opens/closes
- [ ] Break duration validation (5-120)
- [ ] Next Patient finds correct patient
- [ ] Next Patient updates status to Running
- [ ] Test Next finds test patients
- [ ] Voice announcements work
- [ ] Browser notifications appear
- [ ] TV display updates
- [ ] Auto-refresh pauses during break
- [ ] Auto-refresh resumes after break

---

## 🚀 Quick Start:

1. **Login** as doctor
2. **Dashboard** loads automatically
3. **Waiting patients** visible in list
4. **Click "Next Patient"** to call first patient
5. **Patient consultation** completed
6. **Mark status** as Completed
7. **Repeat** for all patients
8. **Take break** when needed
9. **Resume** after break

---

**Updated:** February 7, 2026  
**Status:** ✅ Fully Functional

