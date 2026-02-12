# Sakura - Setup and Development Guide

## Quick Start

### 1. Install Node.js and npm

Make sure you have Node.js 18+ installed:
```bash
node --version
npm --version
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Angular CLI and framework
- Tailwind CSS
- TypeScript
- All required dependencies

### 3. Run Development Server

```bash
npm start
```

or

```bash
ng serve
```

Open your browser and navigate to `http://localhost:4200`

### 4. Default Login Credentials

**Doctor Account:**
- Phone: 01700000000
- Password: password123

**Assistant Account:**
- Phone: 01800000000
- Password: password123

**Note:** These are mock credentials. Connect to actual backend API for real authentication.

## Development Workflow

### Project Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
ng lint
```

### Generating New Components

```bash
# Generate a new component
ng generate component modules/doctor/components/my-component

# Generate a new service
ng generate service core/services/my-service

# Generate a new module
ng generate module modules/my-module --routing
```

## Module Structure

### Core Module (`src/app/core/`)
Contains singleton services and guards:
- `AuthService` - Authentication and user management
- `ApiService` - HTTP requests wrapper
- `StorageService` - Local storage management
- `AuthGuard` - Route protection
- `AuthInterceptor` - JWT token injection

### Shared Module (`src/app/shared/`)
Reusable components and utilities:
- `HeaderComponent` - Top navigation bar
- `SidebarComponent` - Side navigation menu
- `ModalComponent` - Modal dialog
- `LoaderComponent` - Loading spinner
- `StatusBadgeComponent` - Status indicators
- `ConfirmDialogComponent` - Confirmation dialog

### Feature Modules

#### Auth Module (`src/app/modules/auth/`)
- Login page
- Forgot password flow
- OTP verification

#### Doctor Module (`src/app/modules/doctor/`)
- Dashboard with patient list
- Chamber management (CRUD)
- Appointment management
- Settings configuration
- Profile management

#### Assistant Module (`src/app/modules/assistant/`)
- Patient queue management
- Appointment booking
- Report handling

#### Patient Module (`src/app/modules/patient/`)
- Public booking interface
- 3-step booking wizard

#### TV Display Module (`src/app/modules/tv-display/`)
- Real-time patient display
- Doctor information card
- YouTube video integration

## API Integration

### Backend Connection

Update API URL in environment files:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.sakura.com/api'
};
```

### API Endpoints Expected

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password

// Appointments
GET /api/appointments/today
GET /api/appointments/upcoming
POST /api/appointments/book
PUT /api/appointments/:id/status
DELETE /api/appointments/:id

// Chambers
GET /api/chambers
POST /api/chambers
PUT /api/chambers/:id
DELETE /api/chambers/:id
GET /api/chambers/:id/statements

// Patients
GET /api/patients
GET /api/patients/:id
POST /api/patients
PUT /api/patients/:id

// TV Display
GET /api/tv/patient-list
GET /api/tv/live-data
PUT /api/tv/video
```

## Styling Guide

### Tailwind CSS Classes

The project uses utility-first Tailwind CSS with custom configuration:

**Custom Colors:**
```css
sakura-light: #FFB7C5
sakura: #FF69B4
sakura-dark: #FF1493
```

**Common Patterns:**
```html
<!-- Button -->
<button class="btn btn-primary">Click Me</button>

<!-- Card -->
<div class="card">Content</div>

<!-- Input -->
<input class="input" type="text">

<!-- Badge -->
<span class="badge badge-running">Running</span>
```

### Custom Components CSS

Pre-built component classes:
- `.btn` - Base button
- `.btn-primary` - Primary button (sakura)
- `.btn-secondary` - Secondary button
- `.card` - Card container
- `.input` - Form input
- `.badge` - Status badge
- `.status-indicator` - Status dot

## State Management

Currently using:
- **Services with BehaviorSubject** for state
- **RxJS** for reactive programming
- **Local Storage** for persistence

Example:
```typescript
// In service
private currentUserSubject: BehaviorSubject<User | null>;
public currentUser: Observable<User | null>;

// In component
this.authService.currentUser.subscribe(user => {
  this.currentUser = user;
});
```

## Routing and Navigation

### Guards

- `AuthGuard` - Protects routes requiring authentication
- Role-based routing using route data

```typescript
{
  path: 'doctor',
  canActivate: [AuthGuard],
  data: { role: 'doctor' }
}
```

### Lazy Loading

All feature modules are lazy-loaded:

```typescript
{
  path: 'doctor',
  loadChildren: () => import('./modules/doctor/doctor.module')
    .then(m => m.DoctorModule)
}
```

## Real-time Features

### TV Display Auto-refresh

The TV display auto-refreshes every 10 seconds:

```typescript
ngOnInit(): void {
  this.startAutoRefresh();
}

startAutoRefresh(): void {
  setInterval(() => {
    this.loadPatients();
  }, 10000);
}
```

### WebSocket (Future)

For production, replace polling with WebSocket:

```typescript
// Example WebSocket service
connectToSocket() {
  const socket = new WebSocket('ws://localhost:3000');
  socket.onmessage = (event) => {
    this.handleUpdate(JSON.parse(event.data));
  };
}
```

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

### Mobile-First Approach

```html
<!-- Mobile: stack, Desktop: grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Content -->
</div>
```

## Testing

### Unit Tests

Run unit tests:
```bash
ng test
```

### E2E Tests

```bash
ng e2e
```

## Performance Optimization

### Lazy Loading

All feature modules are lazy-loaded to improve initial load time.

### OnPush Change Detection

Consider using OnPush strategy for better performance:

```typescript
@Component({
  selector: 'app-my-component',
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Production Build

```bash
ng build --configuration production
```

This enables:
- AOT compilation
- Tree shaking
- Minification
- Bundling optimization

## Deployment

### Build for Production

```bash
npm run build --configuration production
```

Output will be in `dist/sakura-frontend/`

### Deploy to Server

1. Upload `dist/` folder to web server
2. Configure server for Angular routing (redirect all to index.html)
3. Set environment variables
4. Enable HTTPS
5. Configure CORS on backend

### Nginx Configuration Example

```nginx
server {
  listen 80;
  server_name sakura.com;
  root /var/www/sakura/dist/sakura-frontend;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Troubleshooting

### Port Already in Use

```bash
ng serve --port 4300
```

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```

### Styling Not Applied

```bash
npm run build
# Restart dev server
```

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Support

For issues and questions:
1. Check this guide
2. Review Angular/Tailwind documentation
3. Contact development team

---

Happy Coding! 🌸


