# 🌸 Sakura - Test Credentials

## Quick Login

Use these credentials to test the system:

### ✅ Working Test Account (Verified)
- **Phone**: `01900123456`
- **Password**: `Test@123`
- **Role**: Doctor
- **Status**: ✅ Tested and working
- **Access**: Full system access including chamber management, appointments, and settings

### Doctor Account
- **Phone**: `01700000000`
- **Password**: `Doctor@123`
- **Role**: Doctor
- **Access**: Full system access including chamber management, appointments, and settings

### Assistant Account
- **Phone**: `01800000000`
- **Password**: `Assistant@123`
- **Role**: Assistant
- **Access**: Appointment management and patient registration

## Creating Test Users

### Method 1: Using the Script

```bash
cd backend
node scripts/create-test-user.js
```

### Method 2: Manual Registration (Using cURL)

#### Register Doctor
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01700000000",
    "password": "Doctor@123",
    "fullName": "Dr. Rahman Ahmed",
    "role": "doctor",
    "email": "doctor@sakura.com"
  }'
```

#### Register Assistant
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01800000000",
    "password": "Assistant@123",
    "fullName": "Assistant Sara",
    "role": "assistant",
    "email": "assistant@sakura.com"
  }'
```

### Method 3: Using Swagger UI

1. Open http://localhost:3000/api/docs
2. Navigate to **Auth** → **POST /api/auth/register**
3. Click "Try it out"
4. Enter the user details:
   ```json
   {
     "phone": "01700000000",
     "password": "Doctor@123",
     "fullName": "Dr. Rahman Ahmed",
     "role": "doctor",
     "email": "doctor@sakura.com"
   }
   ```
5. Click "Execute"

## Testing Login

### Method 1: Using the Frontend
1. Open http://localhost:4200
2. Enter phone: `01700000000`
3. Enter password: `Doctor@123`
4. Click "Login"

### Method 2: Using cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01700000000",
    "password": "Doctor@123"
  }'
```

### Method 3: Using Swagger UI
1. Open http://localhost:3000/api/docs
2. Navigate to **Auth** → **POST /api/auth/login**
3. Click "Try it out"
4. Enter credentials
5. Click "Execute"

## Phone Number Format

All Bangladeshi phone numbers must follow this format:
- Start with `01`
- Third digit: 3-9
- Total: 11 digits
- Examples: `01700000000`, `01800000000`, `01900000000`

## Password Requirements

- Minimum 6 characters
- Recommended: Include uppercase, lowercase, numbers, and special characters

## User Roles

- **doctor**: Full access to all features
- **assistant**: Limited access for managing appointments
- **patient**: View appointments and book new ones (mobile app)

## Important Notes

⚠️ These are TEST credentials for development only!
- Never use these in production
- Change passwords before deploying
- Use strong passwords in production
- Enable additional security measures

## Troubleshooting

### 400 Bad Request on Login
- ✅ **FIXED**: Backend now allows extra fields like `rememberMe`
- Verify phone number format (11 digits, starts with 01)
- Check password length (minimum 6 characters)

### User Already Exists
If you get "Phone number already registered":
- User already exists in database
- Try logging in with existing credentials
- Or use a different phone number

### Connection Refused
- Ensure backend is running on port 3000
- Check if PostgreSQL is running
- Verify `.env` configuration

---

**Happy Testing! 🌸**

