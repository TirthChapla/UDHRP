# OTP Forgot Password - Testing Guide

## How to Test the Feature

### Prerequisites
1. Backend server running on port 8080
2. Frontend server running on port 5173 (or your configured port)
3. Email service configured in `application.yml`
4. Valid email address for testing

## Test Steps

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Forgot Password Flow

#### Step A: Navigate to Forgot Password
1. Go to login page: `http://localhost:5173/login`
2. Click "Forgot Password?" link
3. You should see the forgot password page with purple gradient sidebar

#### Step B: Request OTP
1. Enter a valid email address registered in the system
2. Click "Send OTP" button
3. Check console/terminal for email sending confirmation
4. Check your email inbox for OTP code
5. The page should automatically move to Step 2 (OTP verification)

#### Step C: Verify OTP
1. Enter the 6-digit OTP from email
2. Click "Verify OTP" button
3. If correct, page moves to Step 3 (password reset)
4. If incorrect, error message appears

#### Step D: Reset Password & Auto-Login
1. Enter new password (minimum 6 characters)
2. Confirm new password (must match)
3. Click "Reset & Login" button
4. You should be automatically logged in
5. You should be redirected to your dashboard based on role:
   - Patient → `/patient/dashboard`
   - Doctor → `/doctor/dashboard`
   - Receptionist → `/receptionist/dashboard`

### 4. Test Error Cases

#### Invalid Email
- Enter non-existent email
- Should show error: "No account found with this email"

#### Invalid OTP
- Enter wrong 6-digit code
- Should show error: "Invalid OTP"

#### Expired OTP
- Wait more than 10 minutes after receiving OTP
- Try to verify
- Should show error: "OTP has expired"

#### Password Mismatch
- Enter different passwords in Step 3
- Should show error: "Passwords do not match"

### 5. Test Additional Features

#### Resend OTP
1. In Step 2, click "Resend OTP"
2. New OTP should be sent
3. Old OTP becomes invalid

#### Change Email
1. In Step 2, click "Change Email"
2. Should go back to Step 1
3. Can enter different email

#### Back Navigation
- From Step 2 → Back to Step 1
- From Step 3 → Back to Step 2

## Expected Email Content

Subject: "Password Reset OTP"

Email body should contain:
- Large 6-digit OTP code
- 10-minute expiry warning
- Security message about not sharing OTP

## Backend Logs to Check

### When OTP is sent:
```
Generated OTP for user: user@example.com
OTP expiry set to: [timestamp]
Email sent successfully to: user@example.com
```

### When OTP is verified:
```
Verifying OTP for user: user@example.com
OTP verified successfully
```

### When password is reset:
```
Resetting password for user: user@example.com
Password reset successful
JWT token generated for auto-login
```

## Database Verification

After requesting OTP, check User table:
```sql
SELECT email, password_reset_otp, otp_expiry 
FROM users 
WHERE email = 'test@example.com';
```

Should show:
- `password_reset_otp`: 6-digit number
- `otp_expiry`: Current time + 10 minutes

After successful reset:
- `password_reset_otp`: NULL
- `otp_expiry`: NULL
- `password`: [new encrypted password]

## API Testing with Postman/Curl

### 1. Send OTP
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Response:
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

Response:
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### 3. Reset Password with OTP
```bash
curl -X POST http://localhost:8080/api/auth/reset-password-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "otp":"123456",
    "newPassword":"newPassword123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "userId": 1,
    "email": "test@example.com",
    "role": "PATIENT"
  },
  "message": "Password reset successful"
}
```

## Troubleshooting

### Email Not Received
- Check spam/junk folder
- Verify email configuration in application.yml
- Check backend logs for email sending errors
- Verify SMTP settings

### OTP Verification Fails
- Check if OTP expired (10 minutes)
- Verify OTP digits match exactly
- Check database for stored OTP
- Ensure email matches exactly

### Auto-Login Not Working
- Check browser console for errors
- Verify JWT token is being stored in localStorage
- Check if token is returned in API response
- Verify role is correctly set

### Redirect Not Working
- Check user role in database
- Verify navigation paths in code
- Check browser console for navigation errors

## Success Criteria

✅ OTP email received within seconds
✅ OTP can be verified successfully
✅ Password reset completes without errors
✅ User is automatically logged in
✅ User is redirected to correct dashboard
✅ Can login with new password
✅ Old password no longer works
✅ OTP expires after 10 minutes
✅ Resend OTP generates new code
✅ Navigation between steps works smoothly
