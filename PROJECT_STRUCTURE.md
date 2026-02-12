# Sakura - Complete Project Structure

## 📁 Full Directory Tree

```
sakura_05-02-26/
│
├── 📄 Configuration Files
│   ├── angular.json              # Angular CLI configuration
│   ├── package.json              # npm dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tsconfig.app.json         # App-specific TS config
│   ├── tsconfig.spec.json        # Test TS config
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── karma.conf.js             # Karma test runner config
│   ├── .gitignore                # Git ignore rules
│   └── .editorconfig             # Editor configuration
│
├── 📚 Documentation
│   ├── README.md                 # Project overview
│   ├── SETUP_GUIDE.md            # Development guide
│   ├── QUICK_START.md            # Quick start guide
│   ├── PROJECT_SUMMARY.md        # Implementation summary
│   └── PROJECT_STRUCTURE.md      # This file
│
└── 📂 src/                       # Source code
    │
    ├── 🌐 Root Files
    │   ├── index.html            # Main HTML file
    │   ├── main.ts               # Application entry point
    │   ├── styles.scss           # Global styles with Tailwind
    │   └── favicon.ico           # Favicon
    │
    ├── 🔧 environments/          # Environment configurations
    │   ├── environment.ts        # Development environment
    │   └── environment.prod.ts   # Production environment
    │
    └── 📱 app/                   # Application code
        │
        ├── 📄 App Root
        │   ├── app.module.ts           # Root module
        │   ├── app-routing.module.ts   # Root routing
        │   ├── app.component.ts        # Root component
        │   ├── app.component.html      # Root template
        │   └── app.component.scss      # Root styles
        │
        ├── 🔐 core/              # Core functionality (singleton services)
        │   ├── core.module.ts    # Core module
        │   │
        │   ├── services/         # Business logic services
        │   │   ├── auth.service.ts      # Authentication service
        │   │   ├── api.service.ts       # HTTP API service
        │   │   └── storage.service.ts   # Local storage service
        │   │
        │   ├── guards/           # Route guards
        │   │   └── auth.guard.ts        # Authentication guard
        │   │
        │   └── interceptors/     # HTTP interceptors
        │       └── auth.interceptor.ts  # JWT token interceptor
        │
        ├── 🔄 shared/            # Shared resources
        │   ├── shared.module.ts  # Shared module
        │   │
        │   ├── components/       # Reusable components
        │   │   ├── header/
        │   │   │   ├── header.component.ts
        │   │   │   ├── header.component.html
        │   │   │   └── header.component.scss
        │   │   │
        │   │   ├── sidebar/
        │   │   │   ├── sidebar.component.ts
        │   │   │   ├── sidebar.component.html
        │   │   │   └── sidebar.component.scss
        │   │   │
        │   │   ├── loader/
        │   │   │   ├── loader.component.ts
        │   │   │   ├── loader.component.html
        │   │   │   └── loader.component.scss
        │   │   │
        │   │   ├── modal/
        │   │   │   ├── modal.component.ts
        │   │   │   ├── modal.component.html
        │   │   │   └── modal.component.scss
        │   │   │
        │   │   ├── status-badge/
        │   │   │   ├── status-badge.component.ts
        │   │   │   ├── status-badge.component.html
        │   │   │   └── status-badge.component.scss
        │   │   │
        │   │   └── confirm-dialog/
        │   │       ├── confirm-dialog.component.ts
        │   │       ├── confirm-dialog.component.html
        │   │       └── confirm-dialog.component.scss
        │   │
        │   └── pipes/            # Custom pipes
        │       ├── bengali-number.pipe.ts  # Bengali number converter
        │       ├── time-ago.pipe.ts        # Relative time
        │       └── safe.pipe.ts            # URL sanitization
        │
        └── 📦 modules/           # Feature modules (lazy-loaded)
            │
            ├── 🔐 auth/          # Authentication module
            │   ├── auth.module.ts
            │   ├── auth-routing.module.ts
            │   └── pages/
            │       ├── login/
            │       │   ├── login.component.ts
            │       │   ├── login.component.html
            │       │   └── login.component.scss
            │       │
            │       └── forgot-password/
            │           ├── forgot-password.component.ts
            │           ├── forgot-password.component.html
            │           └── forgot-password.component.scss
            │
            ├── 👨‍⚕️ doctor/       # Doctor module
            │   ├── doctor.module.ts
            │   ├── doctor-routing.module.ts
            │   │
            │   ├── layout/       # Doctor layout
            │   │   ├── doctor-layout.component.ts
            │   │   ├── doctor-layout.component.html
            │   │   └── doctor-layout.component.scss
            │   │
            │   ├── pages/        # Doctor pages
            │   │   ├── dashboard/
            │   │   │   ├── dashboard.component.ts
            │   │   │   ├── dashboard.component.html
            │   │   │   └── dashboard.component.scss
            │   │   │
            │   │   ├── chambers/
            │   │   │   ├── chambers.component.ts
            │   │   │   ├── chambers.component.html
            │   │   │   ├── chambers.component.scss
            │   │   │   └── chamber-form/
            │   │   │       ├── chamber-form.component.ts
            │   │   │       ├── chamber-form.component.html
            │   │   │       └── chamber-form.component.scss
            │   │   │
            │   │   ├── appointments/
            │   │   │   ├── appointments.component.ts
            │   │   │   ├── appointments.component.html
            │   │   │   ├── appointments.component.scss
            │   │   │   └── appointment-form/
            │   │   │       ├── appointment-form.component.ts
            │   │   │       ├── appointment-form.component.html
            │   │   │       └── appointment-form.component.scss
            │   │   │
            │   │   ├── settings/
            │   │   │   ├── settings.component.ts
            │   │   │   ├── settings.component.html
            │   │   │   └── settings.component.scss
            │   │   │
            │   │   └── profile/
            │   │       ├── profile.component.ts
            │   │       ├── profile.component.html
            │   │       └── profile.component.scss
            │   │
            │   └── components/   # Doctor-specific components
            │       ├── patient-list/
            │       │   ├── patient-list.component.ts
            │       │   ├── patient-list.component.html
            │       │   └── patient-list.component.scss
            │       │
            │       ├── control-buttons/
            │       │   ├── control-buttons.component.ts
            │       │   ├── control-buttons.component.html
            │       │   └── control-buttons.component.scss
            │       │
            │       └── chamber-stats/
            │           ├── chamber-stats.component.ts
            │           ├── chamber-stats.component.html
            │           └── chamber-stats.component.scss
            │
            ├── 👨‍💼 assistant/   # Assistant module
            │   ├── assistant.module.ts
            │   ├── assistant-routing.module.ts
            │   │
            │   ├── layout/
            │   │   ├── assistant-layout.component.ts
            │   │   ├── assistant-layout.component.html
            │   │   └── assistant-layout.component.scss
            │   │
            │   └── pages/
            │       └── dashboard/
            │           ├── dashboard.component.ts
            │           ├── dashboard.component.html
            │           └── dashboard.component.scss
            │
            ├── 👤 patient/       # Patient module
            │   ├── patient.module.ts
            │   ├── patient-routing.module.ts
            │   └── pages/
            │       └── booking/
            │           ├── booking.component.ts
            │           ├── booking.component.html
            │           └── booking.component.scss
            │
            └── 📺 tv-display/    # TV Display module
                ├── tv-display.module.ts
                ├── tv-display-routing.module.ts
                └── pages/
                    └── tv-display/
                        ├── tv-display.component.ts
                        ├── tv-display.component.html
                        └── tv-display.component.scss
```

## 📊 Statistics

### Files Count
- **TypeScript files**: 60+
- **HTML templates**: 30+
- **SCSS stylesheets**: 30+
- **Configuration files**: 10+
- **Documentation files**: 5

### Modules
- **Core Module**: 1 (Services, Guards, Interceptors)
- **Shared Module**: 1 (Components, Pipes)
- **Feature Modules**: 5 (Auth, Doctor, Assistant, Patient, TV Display)

### Components
- **Shared Components**: 6
- **Doctor Components**: 10+
- **Assistant Components**: 2
- **Patient Components**: 1
- **TV Display Components**: 1
- **Total**: 20+ components

### Services
- **Auth Service**: Authentication & user management
- **API Service**: HTTP requests
- **Storage Service**: Local storage

### Routes
- **Auth Routes**: 2 (Login, Forgot Password)
- **Doctor Routes**: 7 (Dashboard, Chambers, Appointments, Settings, Profile)
- **Assistant Routes**: 1 (Dashboard)
- **Patient Routes**: 1 (Booking)
- **TV Display Routes**: 1 (Display)

## 🎨 Styling Architecture

### Global Styles (`styles.scss`)
- Tailwind CSS directives
- Custom component classes
- Animations
- Scrollbar styling
- Bengali font support

### Tailwind Configuration (`tailwind.config.js`)
- Custom Sakura color palette
- Font family configuration
- Extended theme colors

### Component Styles
- Scoped SCSS for each component
- BEM naming convention (where applicable)
- Responsive utilities from Tailwind

## 🔌 Integration Points

### Backend API
- Environment configuration for API URL
- Auth interceptor for token injection
- Centralized error handling

### External Services
- YouTube API (for video embedding)
- SMS Gateway (placeholder for notifications)
- Payment Gateway (placeholder for payments)

## 📱 Responsive Breakpoints

```scss
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Laptop
xl:  1280px  // Desktop
2xl: 1536px  // Large desktop
```

## 🎯 Module Dependencies

```
AppModule
├── CoreModule (singleton)
│   └── Provides: Services, Guards, Interceptors
│
├── SharedModule (shared)
│   └── Exports: Components, Pipes
│
└── Feature Modules (lazy-loaded)
    ├── AuthModule
    ├── DoctorModule (imports SharedModule)
    ├── AssistantModule (imports SharedModule)
    ├── PatientModule (imports SharedModule)
    └── TvDisplayModule (imports SharedModule)
```

## 🔐 Security Architecture

```
User Request
    ↓
AuthGuard (checks authentication)
    ↓
Route Access Granted
    ↓
HTTP Request
    ↓
AuthInterceptor (adds JWT token)
    ↓
API Backend
    ↓
Response
    ↓
Component (displays data)
```

---

## 📝 Notes

- All feature modules are **lazy-loaded** for optimal performance
- **Shared module** contains reusable components
- **Core module** is imported once in AppModule
- **Reactive forms** used throughout the application
- **RxJS** for state management and async operations
- **Type-safe** with TypeScript strict mode
- **Mobile-first** responsive design approach

---

**Last Updated**: February 5, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready


