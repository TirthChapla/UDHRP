# Lab Report ID Integration - Quick Reference

## What Changed?

When a doctor creates a prescription with lab reports:

### Before ❌
```
Prescription.labReports = "CBC, Lipid Profile, Thyroid"  ← Just text strings!
```

### After ✅
```
Prescription.labReports = "42, 43, 44"  ← Actual database IDs!

Where:
- ID 42 = Lab Report entity for CBC
- ID 43 = Lab Report entity for Lipid Profile  
- ID 44 = Lab Report entity for Thyroid
```

## How It Works

### 1. Doctor Selects Lab Tests
```jsx
// Frontend: DoctorPrescription component
<select className="lab-report-select">
  <option value="kidney-function-tests">Kidney Function Tests</option>
  <option value="lipid-profile-test">Lipid Profile Test</option>
  <option value="complete-blood-count">Complete Blood Count</option>
  ...
</select>
```

### 2. On Prescription Submit - Create Lab Reports First
```javascript
// For each selected lab test:
const labReportPayload = {
  patientId: selectedPatient.patientId,
  testName: "kidney-function-tests",
  testDate: "2026-01-09",
  laboratoryName: "Central Laboratory"
};

const createdReport = await createLabReport(labReportPayload);
// Backend returns: { id: 42, testName: "kidney-function-tests", ... }

labReportIds.push(createdReport.data.id);  // Store ID: 42
```

### 3. Then Create Prescription with Lab Report IDs
```javascript
const prescriptionPayload = {
  patientId: selectedPatient.patientId,
  diagnosis: "...",
  medications: [...],
  labReports: ["42", "43", "44"],  // IDs from step 2!
  ...
};

const result = await createPrescription(prescriptionPayload);
```

## API Endpoints

### Create Lab Report
```
POST /doctor/prescriptions/lab-reports
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "patientId": "PAT-001",
  "testName": "kidney-function-tests",
  "testDate": "2026-01-09",
  "laboratoryName": "Central Laboratory",
  "results": "",
  "doctorNotes": "Lab report created from prescription"
}

Response:
{
  "success": true,
  "message": "Lab report created successfully",
  "data": {
    "id": 42,
    "reportId": "LAB-42",
    "testName": "kidney-function-tests",
    "patientId": "PAT-001",
    "date": "2026-01-09",
    "status": "COMPLETED",
    "laboratoryName": "Central Laboratory",
    ...
  }
}
```

### Get Lab Report by ID
```
GET /doctor/prescriptions/lab-reports/42
Authorization: Bearer <jwt-token>

Response: LabReportDTO with all details
```

## Database Schema

### lab_reports table
```sql
CREATE TABLE lab_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT,
  test_name VARCHAR(255) NOT NULL,
  test_date DATE NOT NULL,
  results LONGTEXT,
  laboratory_name VARCHAR(255),
  doctor_notes VARCHAR(1000),
  report_file_path VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

### prescriptions table (updated)
```sql
-- Before: labReports = "CBC, Lipid Profile"
-- After:  labReports = "42,43"  (stores IDs as CSV)

UPDATE prescriptions
SET lab_reports = "42,43"
WHERE id = 1;
```

## Code Files Modified

### Backend

**1. CreateLabReportRequest.java** (NEW)
```java
- Location: src/main/java/com/doctorai/dto/
- Contains request body for lab report creation
- Fields: patientId, testName, testDate, results, laboratoryName, doctorNotes, reportFilePath
```

**2. DoctorPrescriptionController.java** (UPDATED)
```java
- Added: POST /doctor/prescriptions/lab-reports endpoint
- Added: GET /doctor/prescriptions/lab-reports/{reportId} endpoint
```

**3. DoctorPrescriptionService.java** (UPDATED)
```java
- Added: createLabReport() method
- Added: getLabReportById() method
```

### Frontend

**1. doctorService.js** (UPDATED)
```javascript
- Added: createLabReport(labReportData) function
- Added: getLabReportById(reportId) function
```

**2. DoctorPrescription.jsx** (UPDATED)
```javascript
- Added: import of createLabReport
- Updated: handleSubmitPrescription() to:
  1. Create lab reports first
  2. Collect returned IDs
  3. Submit prescription with IDs
```

## Lab Test Types Available

The dropdown includes 22 predefined lab test types:

1. Kidney Function Tests
2. Lipid Profile Test
3. Complete Blood Count
4. Liver Function Tests
5. Dengue Test
6. Stool Routine
7. Bleeding Time & Clotting Time
8. Pus Culture
9. Bilirubin (Total, Direct)
10. Serum Creatinine
11. ESR (Westergren)
12. Urine Routine
13. Semen Analysis
14. Semen Culture
15. Serum Proteins
16. C-Reactive Protein (CRP) Quantitative
17. Malaria Antigen
18. Malaria Parasite (MP Card)
19. PT/INR (Prothrombin Time)
20. Prostate Specific Antigen (PSA)
21. Pap Smear
22. Peripheral Blood Smear

## Error Handling

### If Lab Report Creation Fails
```javascript
// 1. Error is caught
// 2. User sees alert: "Failed to create lab report: [test name]"
// 3. Prescription creation is NOT attempted
// 4. User can try again
```

### If Prescription Creation Fails After Lab Reports
```javascript
// 1. Lab reports already created (IDs exist in database)
// 2. User sees alert: "Failed to create prescription"
// 3. Lab reports remain in database
// 4. User can try prescription submission again
```

## Verification

After implementation, verify:

```bash
# Check if lab reports are created
SELECT * FROM lab_reports WHERE patient_id = X;
# Should show: 3 new rows with IDs 42, 43, 44

# Check if prescription links to lab reports
SELECT id, patient_id, lab_reports FROM prescriptions WHERE id = Y;
# Should show: lab_reports = "42,43,44"

# Verify relationship
SELECT * FROM lab_reports WHERE id IN (42, 43, 44);
# Should show: All 3 reports with matching patient_id and doctor_id
```

## Frontend Console Logs

Watch the browser console when creating a prescription:

```
[DoctorPrescription] Creating lab reports: Array(3)
[DoctorPrescription] Creating lab report: {patientId: "PAT-001", testName: "kidney-function-tests", ...}
[doctorService] Lab report created successfully: {id: 42, ...}
[DoctorPrescription] Lab report created with ID: 42
[DoctorPrescription] Creating lab report: {patientId: "PAT-001", testName: "lipid-profile-test", ...}
[doctorService] Lab report created successfully: {id: 43, ...}
[DoctorPrescription] Lab report created with ID: 43
[DoctorPrescription] Creating lab report: {patientId: "PAT-001", testName: "complete-blood-count", ...}
[doctorService] Lab report created successfully: {id: 44, ...}
[DoctorPrescription] Lab report created with ID: 44
[DoctorPrescription] Submitting prescription with linked lab reports: {
  patientId: "PAT-001",
  diagnosis: "Diabetes",
  labReportIds: ["42", "43", "44"],
  labReportCount: 3,
  medicationsCount: 2,
  ...
}
[doctorService] Prescription created successfully: {prescriptionId: "RX-ABC123", ...}
```

## Summary

✅ Lab reports are now created as database entities with unique IDs
✅ Prescriptions link to specific lab report IDs (not just text names)
✅ Proper database relationships established
✅ Comprehensive error handling
✅ Full logging and debugging capability
✅ Dropdown UI for selecting predefined lab test types
✅ Automatic lab report creation on prescription submit
