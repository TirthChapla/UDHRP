# OTP-Based Forgot Password Flow

## Overview
Implemented a secure OTP-based password reset system with automatic login after successful password reset.

## Flow Steps

### Step 1: Request OTP
- User enters their email address
- System generates a 6-digit random OTP
- OTP is valid for 10 minutes
- Email sent with OTP code

**API Endpoint:** `POST /auth/forgot-password`
```json
Request: { "email": "user@example.com" }
Response: { "success": true, "message": "OTP sent to your email" }
```

### Step 2: Verify OTP
- User enters the 6-digit OTP received via email
- System validates OTP and checks expiry
- Proceeds to password reset if valid

**API Endpoint:** `POST /auth/verify-otp`
```json
Request: { "email": "user@example.com", "otp": "123456" }
Response: { "success": true, "message": "OTP verified successfully" }
```

### Step 3: Reset Password & Auto-Login
- User enters new password and confirms it
- System resets password and generates JWT token
- User is automatically logged in
- Redirects to appropriate dashboard based on role

**API Endpoint:** `POST /auth/reset-password-otp`
```json
Request: {
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
Response: {
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "type": "Bearer",
    "userId": 123,
    "email": "user@example.com",
    "role": "PATIENT"
  }
}
```

## Backend Implementation

### Modified Files

#### 1. User Entity (`User.java`)
- Added `passwordResetOtp` field (String)
- Added `otpExpiry` field (LocalDateTime)

#### 2. AuthService (`AuthService.java`)
Three new methods:
- `forgotPassword(email)` - Generates and sends OTP via email
- `verifyOtp(email, otp)` - Validates OTP and expiry
- `resetPasswordWithOtp(email, otp, newPassword)` - Resets password and returns JWT token

#### 3. AuthController (`AuthController.java`)
Three endpoints:
- `POST /auth/forgot-password` - Send OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password-otp` - Reset password with auto-login

#### 4. EmailService (`EmailService.java`)
- New method: `sendPasswordResetOtp(email, otp)` - Sends HTML email with styled OTP display

#### 5. New DTOs
- `VerifyOtpRequest.java` - Request DTO with email and otp fields
- `ResetPasswordWithOtpRequest.java` - Request DTO with email, otp, and newPassword fields

## Frontend Implementation

### Modified Files

#### 1. authService.js
Added three new methods:
- `forgotPassword(email)` - Calls forgot-password endpoint
- `verifyOtp(email, otp)` - Calls verify-otp endpoint
- `resetPasswordWithOtp(email, otp, newPassword)` - Calls reset-password-otp endpoint and stores JWT token

#### 2. ForgotPassword Component
Complete refactor to support 3-step flow:

**Step 1 - Email Input:**
- Email input field
- "Send OTP" button
- Back to login link

**Step 2 - OTP Verification:**
- 6-digit OTP input field
- "Verify OTP" button
- "Change Email" and "Resend OTP" options

**Step 3 - Password Reset:**
- New password input
- Confirm password input
- "Reset & Login" button with auto-login icon
- Back to OTP option

#### 3. ForgotPassword.css
- Added `.success-icon-small` for step icons
- Updated `.forgot-password-footer` to support multiple buttons
- Updated `.back-to-login` to work as button element

## Security Features

1. **OTP Expiry:** OTP valid for 10 minutes only
2. **Random Generation:** 6-digit random OTP (000000-999999)
3. **One-Time Use:** OTP cleared after successful password reset
4. **JWT Authentication:** Secure token-based authentication after reset
5. **Password Encoding:** BCrypt encoding for new passwords

## User Experience Enhancements

1. **No Email Links:** Users don't need to switch between email and browser
2. **Quick OTP Entry:** Simple 6-digit code entry
3. **Auto-Login:** Seamless login after password reset
4. **Role-Based Redirect:** Automatic redirect to correct dashboard
5. **Clear Progress:** Visual indicators for each step
6. **Error Handling:** Clear error messages for invalid OTP or expired codes

## Email Template

The OTP email includes:
- Large, monospace OTP display (42px font)
- Dashed border for emphasis
- Gradient background
- 10-minute expiry warning
- Security warning message

## Testing Checklist

- [ ] Send OTP to valid email address
- [ ] Receive OTP email within seconds
- [ ] Verify correct 6-digit OTP
- [ ] Reject invalid OTP
- [ ] Reject expired OTP (after 10 minutes)
- [ ] Reset password successfully
- [ ] Auto-login after password reset
- [ ] Redirect to correct dashboard based on role
- [ ] Resend OTP functionality
- [ ] Change email functionality
- [ ] Back navigation between steps

## Dashboard Redirects

After successful password reset, users are redirected to:
- **Patient:** `/patient/dashboard`
- **Doctor:** `/doctor/dashboard`
- **Receptionist:** `/receptionist/dashboard`
- **Other roles:** `/` (home page)

## Notes

- OTP format: 6 digits (e.g., "042315")
- OTP stored in database temporarily
- OTP and expiry cleared after successful reset
- JWT token stored in localStorage
- User info stored: token, userId, email, role
