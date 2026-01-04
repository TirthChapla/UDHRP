# Doctor AI Backend - API Endpoints Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Most endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📌 Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Patient Profile APIs](#patient-profile-apis)
3. [Health Check APIs](#health-check-apis)

---

## Authentication APIs

### Base Path: `/api/auth`

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user in the system with specified role. A verification email will be sent to the provided email address.

**Authentication:** Not Required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "PATIENT"
}
```

**Available Roles:**
- `PATIENT`
- `DOCTOR`
- `RECEPTIONIST`
- `LABORATORY`
- `INSURANCE`
- `ADMIN`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "PATIENT",
    "isActive": true,
    "emailVerified": false
  }
}
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token.

**Authentication:** Not Required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "userId": 1,
    "email": "user@example.com",
    "role": "PATIENT"
  }
}
```

---

### 3. Get Current User
**Endpoint:** `GET /api/auth/me`

**Description:** Get the profile of currently logged-in user.

**Authentication:** Required 🔒

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "MALE",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "profileImage": null,
    "role": "PATIENT",
    "isActive": true,
    "emailVerified": false
  }
}
```

---

### 4. Update Profile
**Endpoint:** `PUT /api/auth/profile`

**Description:** Update user profile information.

**Authentication:** Required 🔒

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

**Note:** All fields are optional. Only send the fields you want to update.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

---

### 5. Change Password
**Endpoint:** `POST /api/auth/change-password`

**Description:** Change user password (requires current password).

**Authentication:** Required 🔒

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

---

### 6. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request password reset link via email.

**Authentication:** Not Required

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email",
  "data": null
}
```

**Note:** Reset token expires after 1 hour.

---

### 7. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Description:** Reset password using token from email.

**Authentication:** Not Required

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newPassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

**Error Responses:**
- `400 Bad Request`: "Invalid or expired reset token" - Token not found or expired
- `400 Bad Request`: "Reset token has expired" - Token older than 1 hour

---

### 8. Verify Email
**Endpoint:** `GET /api/auth/verify-email?token={token}`

**Description:** Verify user email address with token.

**Authentication:** Not Required

**Query Parameters:**
- `token` (required): Email verification token

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

**Error Responses:**
- `400 Bad Request`: "Invalid verification token" - Token not found
- `400 Bad Request`: "Verification token has expired" - Token older than 24 hours

**Note:** Verification token expires after 24 hours.

---

### 9. Resend Verification Email
**Endpoint:** `POST /api/auth/resend-verification?email={email}`

**Description:** Resend email verification link.

**Authentication:** Not Required

**Query Parameters:**
- `email` (required): User email address

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification email sent",
  "data": null
}
```

---

## Patient Profile APIs

### Base Path: `/api/patient/profile`

### 1. Get Patient Profile
**Endpoint:** `GET /api/patient/profile`

**Description:** Retrieve the current logged-in patient's complete profile information including personal details, medical information, birth information, and family details.

**Authentication:** Required (Bearer Token)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "patient@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15",
    "gender": "MALE",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "profileImage": null,
    "patientId": "PAT-ABC123456",
    "isAlive": true,
    "deathReason": null,
    "bloodGroup": "O+",
    "height": 175.5,
    "weight": 70.0,
    "allergies": "Penicillin, Pollen",
    "chronicDiseases": "None",
    "emergencyContact": "Jane Doe: +1234567891",
    "insuranceProvider": "ABC Insurance",
    "insuranceNumber": "INS123456",
    "birthPlace": "Mumbai, Maharashtra",
    "hospitalName": "Apollo Hospital",
    "specificInstructions": "Allergic to sulfa drugs, Regular blood pressure monitoring required",
    "motherHealthId": "PAT-MOM123456",
    "fatherHealthId": "PAT-DAD789012",
    "parentsAllergies": "Penicillin, Pollen",
    "hasNoParentInfo": false,
    "siblings": ["PAT-SIB123456", "PAT-SIB789012"]
  }
}
```

---

### 2. Update Patient Profile
**Endpoint:** `PUT /api/patient/profile`

**Description:** Update the current logged-in patient's profile information. All fields except firstName and lastName are optional.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "isAlive": true,
  "deathReason": null,
  "bloodGroup": "O+",
  "height": 175.5,
  "weight": 70.0,
  "allergies": "Penicillin, Pollen",
  "chronicDiseases": "None",
  "emergencyContact": "Jane Doe: +1234567891",
  "insuranceProvider": "ABC Insurance",
  "insuranceNumber": "INS123456",
  "birthPlace": "Mumbai, Maharashtra",
  "hospitalName": "Apollo Hospital",
  "specificInstructions": "Allergic to sulfa drugs",
  "motherHealthId": "PAT-MOM123456",
  "fatherHealthId": "PAT-DAD789012",
  "parentsAllergies": "Penicillin, Pollen",
  "hasNoParentInfo": false,
  "siblings": ["PAT-SIB123456", "PAT-SIB789012"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient profile updated successfully",
  "data": {
    "id": 1,
    "email": "patient@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15",
    "gender": "MALE",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "profileImage": null,
    "patientId": "PAT-ABC123456",
    "isAlive": true,
    "deathReason": null,
    "bloodGroup": "O+",
    "height": 175.5,
    "weight": 70.0,
    "allergies": "Penicillin, Pollen",
    "chronicDiseases": "None",
    "emergencyContact": "Jane Doe: +1234567891",
    "insuranceProvider": "ABC Insurance",
    "insuranceNumber": "INS123456",
    "birthPlace": "Mumbai, Maharashtra",
    "hospitalName": "Apollo Hospital",
    "specificInstructions": "Allergic to sulfa drugs",
    "motherHealthId": "PAT-MOM123456",
    "fatherHealthId": "PAT-DAD789012",
    "parentsAllergies": "Penicillin, Pollen",
    "hasNoParentInfo": false,
    "siblings": ["PAT-SIB123456", "PAT-SIB789012"]
  }
}
```

**Notes:**
- `patientId` is auto-generated when a patient record is first created and cannot be changed
- Patient ID format: `PAT-XXXXXXXXX` (9 random alphanumeric characters)
- If `isAlive` is false, `deathReason` should be provided
- If `hasNoParentInfo` is true, parent health IDs and allergies are not required
- `siblings` array can be empty or contain multiple sibling health IDs
- Empty strings in the siblings array are automatically filtered out

---

## Health Check APIs

### Base Path: `/api/`

### 1. API Status
**Endpoint:** `GET /api/`

**Description:** Check if the API is running.

**Authentication:** Not Required

**Response (200 OK):**
```json
{
  "status": "UP",
  "message": "Doctor AI Backend API is running",
  "version": "1.0.0",
  "docs": "/swagger-ui.html"
}
```

---

### 2. Health Check
**Endpoint:** `GET /api/actuator/health`

**Description:** Get application health status.

**Authentication:** Not Required

**Response (200 OK):**
```json
{
  "status": "UP"
}
```

---

## Error Responses

All error responses follow this structure:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email should be valid",
    "password": "Password is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found with email: 'user@example.com'",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred: [error details]",
  "data": null
}
```

---

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "PATIENT"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'
```

### Get current user (replace TOKEN with your JWT):
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Testing with Postman

1. **Import Collection**: Download and import the Postman collection (if available)
2. **Set Base URL**: Create environment variable `baseUrl` = `http://localhost:8080/api`
3. **Set Token**: After login, save the token in environment variable `authToken`
4. **Authorization**: For protected endpoints, use Bearer Token with `{{authToken}}`

---

## Swagger UI Documentation

For interactive API documentation and testing, visit:
```
http://localhost:8080/api/swagger-ui.html
```

---

## Notes

- All timestamps are in ISO 8601 format
- All endpoints return JSON responses
- JWT tokens expire after 24 hours (configurable)
- Email verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- Email service requires SMTP configuration (Gmail, Outlook, SendGrid, etc.)
- The API uses MySQL database (configurable for H2 in development)
- Configure `app.base-url` and `app.frontend-url` in application.yml for email links

---

## Support

For issues or questions, please contact the development team or create an issue in the repository.
