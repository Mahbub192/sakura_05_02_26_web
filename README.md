# Sakura - Doctor Appointment System

A comprehensive web application for managing doctor appointments, built with Angular and Tailwind CSS.

## 🌸 Features

### For Doctors
- **Dashboard** - Real-time patient queue management
- **Patient Management** - Complete patient list with status tracking
- **Chamber Management** - Manage multiple chambers and locations
- **Appointment Scheduling** - Book and manage appointments
- **Control Panel** - Quick actions (Next, Break, Refresh, Test Next)
- **Settings** - Customize audio, display, and system preferences

### For Assistants
- **Patient Queue** - View and manage waiting patients
- **Appointment Booking** - Book appointments for patients
- **Report Management** - Handle patient reports

### For Patients
- **Online Booking** - Easy 3-step booking process
- **No Login Required** - Quick appointments without mandatory registration
- **SMS Notifications** - Receive token numbers via SMS

### TV Display System
- **Real-time Patient List** - Live updates of patient queue
- **Doctor Information** - Display doctor profile and qualifications
- **YouTube Integration** - Play informational videos
- **Break Notices** - Display break messages

## 🚀 Tech Stack

- **Frontend**: Angular 17
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript
- **Icons**: Heroicons (SVG)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm start
```

The application will run on `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, guards, interceptors
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── shared/               # Shared components, pipes, utilities
│   │   ├── components/
│   │   └── pipes/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication (Login, Forgot Password)
│   │   ├── doctor/          # Doctor dashboard and management
│   │   ├── assistant/       # Assistant dashboard
│   │   ├── patient/         # Patient booking
│   │   └── tv-display/      # TV display system
│   └── app.module.ts
├── assets/
├── environments/
└── styles.scss
```

## 🎨 Key Components

### Doctor Dashboard
- Patient list with status indicators
- Control buttons (Appointment, Refresh, Break, Next, Test Next)
- Chamber statistics
- Present/Absent toggle for patients
- Action buttons (Edit, Report, Fee, Token, Bill)

### Chamber Management
- Create/Edit chambers
- Configure days, timings, and fees
- Audio and video settings
- Multiple device support

### TV Display
- Split-screen layout (Patient list + Doctor info + Video)
- Auto-refresh every 10 seconds
- YouTube video integration
- Break notices display

### Patient Booking
- 3-step booking process:
  1. Select Chamber & Date
  2. Personal Information
  3. Confirm Booking
- No mandatory login required
- SMS notification system

## 🔐 User Roles

1. **Admin** - Full system access
2. **Doctor** - Manage appointments, chambers, assistants
3. **Assistant** - Book appointments, manage reports
4. **Patient** - Book appointments, view history (optional login)

## 🎯 API Integration

The application is designed to work with a NestJS backend. Update the API URL in:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🌐 Routes

- `/auth/login` - Login page
- `/auth/forgot-password` - Password recovery
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/chambers` - Chamber management
- `/doctor/appointments` - Appointment list
- `/doctor/settings` - System settings
- `/assistant/dashboard` - Assistant dashboard
- `/patient/book` - Patient booking
- `/tv-display` - TV display system

## 🎨 Design Features

- **Responsive Design** - Works on all devices
- **Modern UI** - Clean and intuitive interface
- **Tailwind CSS** - Utility-first styling
- **Animations** - Smooth transitions and effects
- **Color Scheme** - Sakura (pink) themed

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Build

```bash
# Development build
npm run build

# Production build
npm run build --configuration production
```

## 🧪 Testing

```bash
npm test
```

## 📝 Development Notes

### Adding New Features
1. Create feature module in `src/app/modules/`
2. Add routing configuration
3. Import shared module for reusable components
4. Follow existing patterns for consistency

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use predefined color scheme (sakura theme)
- Keep components modular and reusable

### Code Standards
- TypeScript strict mode enabled
- Follow Angular style guide
- Use reactive forms
- Implement proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Project Name**: Sakura
- **Type**: SaaS Platform
- **Purpose**: Single Doctor Appointment Management

## 📞 Support

For support and queries, please contact the development team.

## 🔮 Future Enhancements

- AI-powered patient symptom checker
- Telemedicine integration
- Video consultations
- E-prescriptions
- Advanced analytics dashboard
- Multi-language support (English/Bengali)
- SMS gateway integration
- Payment gateway integration
- Mobile app (React Native)

---

**Built with ❤️ using Angular and Tailwind CSS**


