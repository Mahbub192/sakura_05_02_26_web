# Sakura - Quick Start Guide

## ⚡ 3-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Start Server (10 seconds)
```bash
npm start
```

### Step 3: Open Browser (5 seconds)
Navigate to: `http://localhost:4200`

---

## 🎯 Quick Navigation

### Login Page
**URL:** `http://localhost:4200/auth/login`

Mock Credentials:
- Phone: `01700000000`
- Password: `password123`

### Doctor Dashboard
**URL:** `http://localhost:4200/doctor/dashboard`

Features:
- Patient queue management
- Control buttons (Next, Break, Refresh)
- Chamber statistics
- Real-time updates

### Patient Booking
**URL:** `http://localhost:4200/patient/book`

No login required - 3-step booking process

### TV Display
**URL:** `http://localhost:4200/tv-display`

Full-screen patient display system

---

## 🏗️ Project Structure (Simplified)

```
src/app/
├── core/          # Services, Guards, Interceptors
├── shared/        # Reusable Components & Pipes
└── modules/
    ├── auth/      # Login & Password Recovery
    ├── doctor/    # Doctor Dashboard & Management
    ├── assistant/ # Assistant Dashboard
    ├── patient/   # Patient Booking
    └── tv-display/# TV Display System
```

---

## 🎨 Key Features

### ✅ For Doctors
- Patient queue with real-time status
- Chamber management (create, edit, delete)
- Appointment scheduling
- Settings configuration
- Break management

### ✅ For Assistants
- Patient queue view
- Book appointments
- Manage reports

### ✅ For Patients
- Easy 3-step booking
- No login required
- SMS notifications

### ✅ TV Display
- Real-time patient list
- Doctor information
- YouTube video integration
- Auto-refresh every 10s

---

## 🔧 Common Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Check for errors
npm run lint
```

---

## 📱 Test Responsive Design

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

---

## 🎨 Customize Theme

Edit `tailwind.config.js`:

```javascript
sakura: {
  light: '#FFB7C5',  // Light pink
  DEFAULT: '#FF69B4', // Main pink
  dark: '#FF1493',    // Dark pink
}
```

---

## 🔌 Connect to Backend

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // Your backend URL
};
```

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
ng serve --port 4300
```

### Styles Not Loading?
```bash
npm run build
# Then restart server
```

### Module Not Found?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learn More

- **README.md** - Complete project overview
- **SETUP_GUIDE.md** - Detailed development guide
- **PROJECT_SUMMARY.md** - Implementation details

---

## 🎉 You're Ready!

The application is fully functional with:
- ✅ Modern UI with Sakura theme
- ✅ Responsive design
- ✅ Complete feature set
- ✅ Ready for backend integration

Happy Coding! 🌸


