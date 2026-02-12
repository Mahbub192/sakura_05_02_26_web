# 🪄 Auto-Generate Slots - Quick Guide

## 🎯 এক নজরে (At a Glance)

**Waiting Time** দিয়ে automatically appointment slots তৈরি হবে!

## 📱 ব্যবহার করুন (How to Use)

### 3 টি সহজ ধাপ (3 Easy Steps):

#### 1️⃣ Chamber Setup করুন
```
Opening Time:     09:00
Closing Time:     17:00
Waiting Time:     15 minutes  ← এটা দিয়ে calculate হবে!
Available Days:   Sat, Sun, Mon
```

#### 2️⃣ Appointment Slots Page এ যান
```
http://localhost:4200/doctor/appointment-slots
```

#### 3️⃣ Auto-Generate Button Click করুন
```
[Auto Generate from Chamber] ← এই button click করুন
```

## 🧮 Calculation কিভাবে হয় (How It Calculates)

```
Opening: 09:00
Closing: 17:00
Total:   8 hours = 480 minutes

Waiting Time: 15 minutes per patient

Max Patients = 480 ÷ 15 = 32 patients ✅
```

## 💡 বিভিন্ন উদাহরণ (Different Examples)

### Quick Visit (10 min)
```
480 minutes ÷ 10 = 48 patients
```

### Regular Visit (15 min)
```
480 minutes ÷ 15 = 32 patients
```

### Detailed Visit (20 min)
```
480 minutes ÷ 20 = 24 patients
```

### Long Consultation (30 min)
```
480 minutes ÷ 30 = 16 patients
```

## 🎨 Frontend এ কি দেখবেন (What You'll See)

### Before
```
[Create New Slot]
```

### After (New!)
```
[🪄 Auto Generate from Chamber]  [Create Manually]
```

### Success Message
```
✅ Auto-generated successfully!
Total time: 480 minutes
Per patient: 15 minutes
Max patients: 32
Slots created: 7
```

## 🚀 API দিয়ে (Using API)

### Single Day
```bash
curl -X POST http://localhost:3000/api/appointment-slots/auto-generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chamberId": 1,
    "startDate": "2026-02-10"
  }'
```

### Multiple Days (এক সপ্তাহ)
```bash
curl -X POST http://localhost:3000/api/appointment-slots/auto-generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chamberId": 1,
    "startDate": "2026-02-10",
    "endDate": "2026-02-16"
  }'
```

## ✅ সুবিধা (Benefits)

```
✅ Manual calculation লাগবে না
✅ একবারে অনেক দিনের slots তৈরি
✅ Error-free automatic calculation
✅ Chamber settings থেকে সব নিবে
✅ Realistic capacity management
```

## 🎯 পূর্ণ গাইড (Full Guide)

বিস্তারিত জানতে দেখুন: **AUTO_GENERATE_SLOTS_GUIDE.md**

---

**🌸 Sakura - Smart Appointment Management!**

