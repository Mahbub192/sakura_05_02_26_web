# 🌸 Sakura - Quick Reference Card

## 🚀 URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:4200 |
| **Backend API** | http://localhost:3000/api |
| **API Docs** | http://localhost:3000/api/docs |
| **TV Display** | http://localhost:4200/tv-display |

## 🔐 Login Credentials

```
Phone: 01900123456
Password: Test@123
Role: Doctor
```

## ⚡ Quick Start

### Start Frontend
```bash
cd /Users/mahbub/Desktop/sakura_05-02-26
npm start
```

### Start Backend
```bash
cd /Users/mahbub/Desktop/sakura_05-02-26/backend
npm run start:dev
```

### Start Database
```bash
brew services start postgresql  # macOS
# or
sudo service postgresql start    # Linux
```

## 📞 API Endpoints

```
POST   /api/auth/login           # Login
POST   /api/auth/register        # Register
GET    /api/chambers             # List chambers
POST   /api/chambers             # Create chamber
GET    /api/appointments         # List appointments
POST   /api/appointments         # Book appointment
GET    /api/patients             # List patients
POST   /api/patients             # Add patient
GET    /api/tv/live-data         # TV display data
```

## 🛠️ Useful Commands

```bash
# Frontend
npm start                        # Start dev server
npm run build                    # Build for production
npm test                         # Run tests

# Backend
npm run start:dev                # Start with watch mode
npm run build                    # Build
npm run start:prod               # Start production

# Database
psql -U postgres -d sakura_db    # Connect to DB
\dt                              # List tables
\d users                         # Describe table
```

## 📂 Key Files

```
src/app/app-routing.module.ts    # Frontend routes
src/app/core/services/           # Frontend services
backend/src/main.ts              # Backend entry
backend/src/app.module.ts        # Backend root module
backend/.env                     # Environment config
```

## 🐛 Troubleshooting

### Frontend won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Can't login
- Use phone: `01900123456`
- Use password: `Test@123`
- Check backend is running on port 3000
- Check browser console for errors

### Database issues
```bash
# Check if PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql  # macOS

# Create database if missing
psql -U postgres
CREATE DATABASE sakura_db;
\q
```

## 📊 System Status Check

```bash
# Check if frontend is running
curl http://localhost:4200

# Check if backend is running
curl http://localhost:3000

# Check database connection
psql -U postgres -d sakura_db -c "SELECT 1"
```

## 🔥 Hot Tips

1. **Swagger UI**: Best way to test APIs → http://localhost:3000/api/docs
2. **Dev Tools**: Open browser console (F12) to see requests
3. **Watch Mode**: Backend auto-reloads on file changes
4. **Phone Format**: Must be 11 digits starting with 01[3-9]
5. **JWT Token**: Copy from login response, use in "Authorize" button

## 📖 Documentation Files

```
STATUS.md              # Current system status
TEST_CREDENTIALS.md    # All login credentials
FIXED_ISSUES.md        # What was fixed today
QUICK_REFERENCE.md     # This file
PROJECT_SUMMARY.md     # Complete documentation
backend/QUICKSTART.md  # Backend setup guide
```

## 🎯 Common Tasks

### Create New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01900000001",
    "password": "Password@123",
    "fullName": "New User",
    "role": "doctor",
    "email": "user@example.com"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01900123456","password":"Test@123"}'
```

### View All Users (requires JWT)
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🌟 Features

- ✅ JWT Authentication
- ✅ Role-based Access (Doctor/Assistant/Patient)
- ✅ Chamber Management
- ✅ Appointment System
- ✅ Patient Records
- ✅ TV Display for Queue
- ✅ Real-time Updates
- ✅ Bengali Number Support
- ✅ Beautiful Tailwind UI
- ✅ Responsive Design

## 📱 Mobile App (Future)

React Native app will be built in the next phase:
- Patient booking
- Appointment tracking
- Push notifications
- Queue status

## 🎉 You're All Set!

Everything is working perfectly. Start by:
1. Opening http://localhost:4200
2. Logging in with `01900123456` / `Test@123`
3. Exploring the dashboard
4. Creating your first chamber
5. Adding patients
6. Booking appointments

---

**Need Help?** Check the documentation files above!
**Having Issues?** See `FIXED_ISSUES.md` for solutions!

**Made with 🌸 Love**

