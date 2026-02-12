# 🌸 User Registration Guide

## ✅ Working Test Account (Already Registered)

```json
Phone: 01900123456
Password: Test@123
Role: Doctor
Status: ✅ Active
```

## ❌ Common Error: Duplicate Phone Number

If you see this error:
```
duplicate key value violates unique constraint "UQ_97672ac88f789774dd47f7c8be3"
```

**Reason**: The phone number is already registered in the database.

## 🆕 How to Register New Users

### Method 1: Use Different Phone Numbers

Each user must have a **unique phone number**. Try these:

#### Register Additional Doctors
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01712345678",
    "email": "doctor1@sakura.com",
    "password": "Doctor@123",
    "fullName": "Dr. Abdul Rahman",
    "role": "doctor"
  }'
```

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01812345678",
    "email": "doctor2@sakura.com",
    "password": "Doctor@123",
    "fullName": "Dr. Fatima Khan",
    "role": "doctor"
  }'
```

#### Register Assistants
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01912345678",
    "email": "assistant1@sakura.com",
    "password": "Assistant@123",
    "fullName": "Assistant Sara",
    "role": "assistant"
  }'
```

### Method 2: Check Existing Users First

Before registering, check if a phone number is already taken:

```bash
# Login first to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01900123456","password":"Test@123"}'

# Use the token to check users (admin/doctor only)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 Valid Phone Number Format

Bangladesh phone numbers must follow this format:
```
✅ 01712345678  (Starts with 01, third digit 3-9, total 11 digits)
✅ 01812345678
✅ 01912345678
✅ 01512345678

❌ 1712345678   (Missing leading 0)
❌ 017123456    (Too short)
❌ 01212345678  (Third digit must be 3-9)
```

## 🎯 Quick Registration Examples

### Example 1: Register via Frontend
1. Go to: http://localhost:4200/auth/register (if you create this page)
2. Or use the API directly

### Example 2: Register via Swagger UI
1. Open: http://localhost:3000/api/docs
2. Find **POST /api/auth/register**
3. Click "Try it out"
4. Enter your details:
   ```json
   {
     "phone": "01712345678",
     "email": "yourname@example.com",
     "password": "YourPassword@123",
     "fullName": "Your Full Name",
     "role": "doctor"
   }
   ```
5. Click "Execute"

### Example 3: Register Multiple Users at Once

Create a script to register multiple users:

```bash
#!/bin/bash

# Register 5 doctors
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"01711111111","password":"Pass@123","fullName":"Dr. User 1","role":"doctor","email":"user1@test.com"}'

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"01722222222","password":"Pass@123","fullName":"Dr. User 2","role":"doctor","email":"user2@test.com"}'

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"01733333333","password":"Pass@123","fullName":"Dr. User 3","role":"doctor","email":"user3@test.com"}'
```

## 🔍 Troubleshooting

### Error: Duplicate Phone Number
**Solution**: Use a different phone number

```bash
# Try with a unique phone number
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01799999999",
    "email": "unique@example.com",
    "password": "Password@123",
    "fullName": "New User",
    "role": "doctor"
  }'
```

### Error: Invalid Phone Number Format
**Solution**: Ensure phone number matches Bangladesh format (01XXXXXXXXX)

### Error: Password Too Short
**Solution**: Password must be at least 6 characters

## 💡 Pro Tips

1. **Test with Sequential Numbers**
   ```
   01700000001, 01700000002, 01700000003...
   ```

2. **Use Different Operators**
   - 017 (Grameenphone)
   - 018 (Robi)
   - 019 (Banglalink)
   - 015 (Teletalk)
   - 016 (Airtel)
   - 013 (GP)
   - 014 (Banglalink)

3. **Keep Track of Registered Numbers**
   - Save them in a text file
   - Or query the database

4. **For Testing**
   - Use simple patterns like: 01711111111, 01722222222
   - Easy to remember!

## 🗑️ Delete/Reset Users

If you need to start fresh:

```bash
# Connect to PostgreSQL
psql -U postgres -d sakura_db

# View all users
SELECT phone, full_name, role FROM users;

# Delete a specific user (be careful!)
DELETE FROM users WHERE phone = '01700000001';

# Or delete all test users
DELETE FROM users WHERE phone LIKE '017%';

# Exit
\q
```

## ✅ Recommended Test Users

For a complete test environment, register these:

```bash
# Doctor 1
Phone: 01900123456 (Already exists)
Password: Test@123
Role: Doctor

# Doctor 2
Phone: 01712345678
Password: Doctor@123
Role: Doctor

# Assistant 1
Phone: 01812345678
Password: Assistant@123
Role: Assistant

# Assistant 2
Phone: 01912345678
Password: Assistant@123
Role: Assistant
```

## 🎉 Quick Fix for Your Current Issue

Since `01700000001` is already taken, use this instead:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01755555555",
    "email": "rahman@sakura.com",
    "password": "Rahman@123",
    "fullName": "Dr. Abdul Rahman",
    "role": "doctor"
  }'
```

**This will work! ✅**

---

**Need more help? Check `TEST_CREDENTIALS.md` for existing accounts!**

