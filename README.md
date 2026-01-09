
# Unified Digital Health Record Platform (UDHRP)

## Product Vision
In India, there is currently no single unified system to record and manage all medical information of a person across their lifetime. This product aims to solve that problem by creating a secure, centralized, and lifelong digital medical record system for every individual, starting from birth and continuing throughout their life.

---

## Core Concept
- Maintain **all medical information of a person** in one system.
- Begin tracking **from the moment a child is born**.
- Provide **role-based access** to patients, doctors, laboratories, and insurance companies.
- Enable **AI-driven insights, reminders, and preventive healthcare guidance**.

---

## Lifecycle Coverage: From Birth to Adulthood

### Child Birth Module
- Unique Health ID generation
- Linking with:
  - Birth Certificate
  - Aadhaar Card (when issued)
- Medical data entry:
  - Birth details
  - Treatments provided
  - Initial health conditions
- Parent information storage:
  - Mother and father medical history
  - Genetic disease indicators (e.g., diabetes)

---

### Automatic Health Reminders
- Child vaccination reminders
- COVID vaccination reminders
- Half-yearly / yearly laboratory test reminders
- Push notifications via app, SMS, and email

---

## AI Integration (Preventive & Predictive Healthcare)
- AI trained on:
  - Doctor research papers
  - MBBS and medical reference books
  - Government health guidelines
- AI-driven features:
  - Personalized health precautions based on age and history
  - Risk prediction for genetic and lifestyle diseases
  - Preventive care suggestions
- Goal: Help individuals live a healthier and longer life

---

## Patient Module

### Patient Profile (My Profile)
Complete patient information management with the following fields:

#### Personal Information
- **Name**: Patient's full name
- **Date of Birth**: Patient's date of birth
- **Patient ID**: 
  - Auto-generated unique identifier
  - Cannot be edited
  - Assigned once and never changes
- **Status Toggle**: Patient alive or deceased
  - If deceased: Input field for "Death due to..." (cause of death)

#### Family Information
- **Parents Information**:
  - Mother's Unique Health ID
  - Father's Unique Health ID
  - Parents' allergies information
  - Toggle option: "No parent information available" (if patient has no parent info)
- **Siblings Information** (Optional):
  - Default: 2 sibling ID input fields
  - "Add Sibling" button to add more sibling IDs
  - Not compulsory to fill

#### Medical Information
- **Blood Group**: Patient's blood group
- **Birth Information**:
  - Birth place (city/location)
  - Hospital name where born
- **Specific Instructions**: Any special medical instructions to follow

---

### Doctor Search & Appointment
- Search doctors by:
  - City
  - Disease specialization
  - Doctor name
- Doctor profile view:
  - Experience
  - Practice address
  - Ratings
  - Availability (e.g., 10 AM – 5 PM)
- Appointment booking
- Notification after doctor approval or rescheduling

### Laboratory Search
- Search laboratories by:
  - City
  - Laboratory name

### Patient Health Records

#### Prescription Management
- **View All Prescriptions**: 
  - Card-based display showing all prescriptions from consulted doctors
  - Each card displays:
    - Doctor name and specialization
    - Date and time of consultation
    - Diagnosis summary
    - Number of medications prescribed
    - Follow-up information
- **Search Prescriptions**:
  - Search by doctor name
  - Search by diagnosis keywords
  - Real-time filtering
- **Filter Prescriptions**:
  - Filter by specific doctor (only shows doctors who have treated the patient)
  - Filter by month
  - Filter by year
  - Clear all filters option
- **Full Prescription View**:
  - Click any prescription card to view complete details
  - Detailed information includes:
    - Complete doctor information with specialization
    - Full diagnosis
    - All prescribed medications with:
      - Medication name
      - Dosage
      - Frequency (e.g., twice daily, once at night)
      - Duration (e.g., 7 days, 30 days)
    - Detailed medical instructions
    - Recommended laboratory tests
    - Follow-up schedule
  - Download prescription as PDF
- **Responsive Design**: 
  - Mobile-friendly interface
  - Adapts to all screen sizes

#### Lifestyle Information Management
- Update lifestyle information:
  - Alcohol consumption
  - Smoking habits
  - Exercise routine
  - Dietary habits

#### Laboratory Reports
- View all lab reports uploaded by laboratories
- Download lab reports in PDF format
- Filter reports by date and test type

---

## Doctor Module

### Doctor Registration
- Government-issued license verification
- Profile creation:
  - Experience
  - Education (college/university)
  - Current practice address
  - Ratings from patients

---

## Doctor Appointment Dashboard
- View appointment requests
- Approve or reschedule appointments
- Manage daily schedule

---

## Doctor Checkup Dashboard

When a patient visits the doctor:

- Patient provides Unique Health ID
- Doctor accesses patient profile

### Dashboard Features
- Patient profile overview
- Allergies and risk factors
- Previous prescriptions and checkup history
- Create new prescription:
  - Auto-filled patient details (name, age, gender, date)
  - Standardized prescription format
- Medicine integration grid:
  - Medicine Name
  - Company (optional)
  - Morning / Afternoon / Night
  - Before or After meals
  - Dosage (tablets or ml)
- Test recommendations:
  - Laboratory tests
  - X-ray
  - MRI
- Doctor footer and digital signature

### Medical History Storage
- Doctor records
- Pharmacy prescriptions
- Laboratory reports

---

## Laboratory Dashboard
- Laboratory registration via government license
- Patient ID-based sample collection
- Upload reports to patient profile
- Automatic patient notifications

### Diagnostic Services Covered
- Blood tests
- X-ray
- MRI
- Other diagnostic imaging and pathology services

---

## Business Analytics Module
- Aggregated, anonymized health data analytics
- Disease trend analysis
- Regional health insights (without violating privacy laws)

---

## Insurance Company Dashboard

### Registration
- Company onboarding with proper documentation
- Secure login credentials provided

### Insurance Assessment Flow
- User provides their Unique Health ID
- Insurance company gets:
  - Read-only access to health profile
- AI-powered health scoring:
  - Health percentage score generation
  - Based on:
    - Medical history
    - Prescriptions
    - Lifestyle data
    - Laboratory reports

---

## Security & Compliance Requirements
- Role-based access control (RBAC)
- End-to-end encryption
- Compliance with:
  - Indian IT Act
  - Digital Health Mission (NDHM)
- Audit logs for all data access
- Consent-based data sharing

---

## 📚 Documentation & Feature Guides

### Complete API & Implementation Docs
1. **[Patient Lab Reports API](./PATIENT_LAB_REPORTS_API.md)** - Complete patient lab report REST API with 11 endpoints
2. **[Prescription Lab Reports Feature](./PRESCRIPTION_LAB_REPORTS_FEATURE.md)** - End-to-end implementation for lab reports linked to prescriptions
3. **[Backend API Endpoints](./backend/API_ENDPOINTS.md)** - All backend REST endpoints including medical records APIs
4. **[Backend Security](./backend/SECURITY.md)** - JWT authentication and authorization details

### Reference Guides
- **[Lab Report ID Quick Reference](./LAB_REPORT_ID_QUICK_REFERENCE.md)** - Lab report ID implementation reference
- **[Lab Report ID Prescription Integration](./LAB_REPORT_ID_PRESCRIPTION_INTEGRATION.md)** - Prescription-lab report mapping details
- **[Medical Records Implementation Summary](./MEDICAL_RECORDS_IMPLEMENTATION_SUMMARY.md)** - Patient prescriptions overview

### Setup & Feature Guides
- **[Backend Setup Guide](./BACKEND_SETUP_GUIDE.md)** - Environment setup and configuration
- **[OTP & Forgot Password Flow](./OTP_FORGOT_PASSWORD_FLOW.md)** - Authentication flow
- **[Receptionist Endpoints](./RECEPTIONIST_ENDPOINTS_IMPLEMENTATION.md)** - Receptionist APIs

---

## Non-Functional Requirements
- High availability and scalability
- Mobile and web applications
- Offline data sync for rural areas
- Cloud-native architecture
- Disaster recovery and backups
- **Enterprise-Ready Architecture**:
  - Separation of concerns (Services, Components, Pages)
  - Reusable component library
  - Centralized API layer
  - State management
  - Loading and error states
  - Responsive design system

---

## Future Enhancements
- Integration with government health systems
- Wearable device integration
- Telemedicine support
- Multilingual support for Indian languages

---

## Conclusion
This platform aims to become India’s unified digital health backbone, ensuring lifelong, secure, and intelligent medical record management while empowering patients, doctors, laboratories, and insurance providers through technology and AI.
