# Patient Lab Reports API - Complete Documentation

## 📋 Overview

Successfully implemented complete patient-facing lab report functionality with:
- Lab report retrieval (all, by ID, filtered)
- Filter by doctor, month, year, and status
- Lab reports linked to prescriptions
- Direct lab report preview from prescription card

## 🏗️ Backend API Endpoints

### 1. **Get All Lab Reports**
```
GET /patient/medical-records/lab-reports
Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "message": "Lab reports retrieved successfully",
  "data": [
    {
      "id": 1,
      "reportId": "LAB-1",
      "date": "2025-12-15",
      "testName": "Complete Blood Count",
      "status": "completed",
      "laboratoryName": "Central Laboratory",
      "doctorName": "Dr. Sarah Patel",
      "patientId": "PAT-001",
      "patientName": "John Doe",
      "results": "...",
      "doctorNotes": "Results within normal limits",
      "reportFilePath": null
    }
  ]
}
```

**Logs:**
```
[INFO] Fetching lab reports for patient with email: john@example.com
[INFO] Found X lab reports for patient ID: Y
```

---

### 2. **Get Specific Lab Report**
```
GET /patient/medical-records/lab-reports/{id}
Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "message": "Lab report retrieved successfully",
  "data": {
    "id": 1,
    "reportId": "LAB-1",
    "date": "2025-12-15",
    "testName": "Complete Blood Count",
    "status": "completed",
    "laboratoryName": "Central Laboratory",
    "doctorName": "Dr. Sarah Patel",
    "patientName": "John Doe",
    "results": "WBC: 7.5, RBC: 4.5, Hb: 13.5",
    "doctorNotes": "All values within normal range",
    "reportFilePath": null
  }
}
```

**Error Cases:**
- `404` - Lab report not found
- `403` - Lab report doesn't belong to logged-in patient

**Logs:**
```
[INFO] Fetching lab report ID: X for patient email: john@example.com
[ERROR] Lab report not found with ID: X
[ERROR] Lab report ID: X does not belong to patient ID: Y
```

---

### 3. **Get Unique Doctors (Lab Reports)**
```
GET /patient/medical-records/lab-reports/doctors
Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "message": "Lab report doctors list retrieved successfully",
  "data": ["Sarah", "Rajesh", "Amit"]
}
```

**Logs:**
```
[INFO] Fetching unique doctors from lab reports for patient: john@example.com
[DEBUG] Found 3 unique lab report doctors for patient
```

---

### 4. **Get Unique Years (Lab Reports)**
```
GET /patient/medical-records/lab-reports/years
Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "message": "Lab report years retrieved successfully",
  "data": [2025, 2024, 2023]
}
```

---

### 5. **Filter Lab Reports**
```
GET /patient/medical-records/lab-reports/filter
Authorization: Bearer {JWT_TOKEN}

Query Parameters:
- search (optional): Search by doctor name, test name, or report ID
- doctor (optional): Filter by doctor name
- month (optional): Filter by month (1-12)
- year (optional): Filter by year
- status (optional): Filter by status (pending, completed, reviewed)
```

**Example:**
```
GET /patient/medical-records/lab-reports/filter?search=blood&doctor=Sarah&month=12&year=2025
```

**Response:**
```json
{
  "success": true,
  "message": "Lab reports filtered successfully",
  "data": [
    {
      "id": 1,
      "reportId": "LAB-1",
      "date": "2025-12-15",
      "testName": "Complete Blood Count",
      "status": "completed",
      "laboratoryName": "Central Laboratory",
      "doctorName": "Dr. Sarah",
      "patientName": "John Doe",
      "results": "..."
    }
  ]
}
```

**Logs:**
```
[INFO] Filtering lab reports - email: john@example.com, search: blood, doctor: Sarah, month: 12, year: 2025
[INFO] Found 1 lab reports matching filter criteria
```

---

### 6. **Get Lab Reports for Prescription** ⭐ **NEW**
```
GET /patient/medical-records/prescriptions/{prescriptionId}/lab-reports
Authorization: Bearer {JWT_TOKEN}
```

**Purpose:** Fetch all lab reports linked to a specific prescription

**Response:**
```json
{
  "success": true,
  "message": "Lab reports retrieved successfully",
  "data": [
    {
      "id": 2,
      "reportId": "LAB-2",
      "date": "2025-12-10",
      "testName": "Lipid Profile",
      "status": "completed",
      "laboratoryName": "Metropolis Healthcare",
      "doctorName": "Dr. Rajesh Kumar",
      "patientName": "John Doe",
      "results": "Total Cholesterol: 180, LDL: 100, HDL: 50"
    },
    {
      "id": 5,
      "reportId": "LAB-5",
      "date": "2025-12-12",
      "testName": "Liver Function Test",
      "status": "completed",
      "laboratoryName": "Apollo Diagnostics",
      "doctorName": "Dr. Priya Menon",
      "patientName": "John Doe",
      "results": "ALT: 25, AST: 30, Total Bilirubin: 0.9"
    }
  ]
}
```

**Error Cases:**
- `404` - Prescription not found
- `403` - Prescription doesn't belong to logged-in patient

**Logs:**
```
[INFO] Fetching lab reports for prescription ID: X and patient: john@example.com
[INFO] Found 2 lab reports for prescription ID: X
[DEBUG] Skipping non-numeric lab report reference on prescription X: invalid-id
```

---

## 🎨 Frontend Integration

### **Service Function: `getLabReportsForPrescription(prescriptionId)`**

**Location:** `frontend/src/services/patientService.js`

```javascript
export const getLabReportsForPrescription = async (prescriptionId) => {
  if (!prescriptionId) return [];
  try {
    console.log('[patientService] Fetching lab reports for prescription:', prescriptionId);
    const response = await apiRequest(
      `/patient/medical-records/prescriptions/${prescriptionId}/lab-reports`,
      'GET'
    );
    const labReports = response.data || [];
    return labReports.map(normalizeLabReport).filter(Boolean);
  } catch (error) {
    console.error('Error fetching lab reports for prescription:', error);
    throw error;
  }
};
```

**Normalization:** Lab reports are normalized to include:
- `id`, `reportId`, `testName`, `labName`, `doctorName`, `doctorSpecialization`
- `date`, `time`, `status`, `preview`, `results` (as table rows), `notes`

---

### **UI Component: Prescription Card Dropdown**

**Location:** `frontend/src/components/PrescriptionCard/PrescriptionCard.jsx`

**Features:**
1. **Lab Reports Button** - Shows only if prescription has linked reports
   - Blue gradient button with dropdown icon
   - Displays "Lab Reports" label
   - Animated dropdown arrow
   
2. **No Reports Badge** - Shows when no reports linked
   - Red badge with "No lab reports linked" message
   - Indicates no linked lab tests

3. **Dropdown Interaction:**
   - Click button to toggle dropdown menu
   - Menu shows "Related Reports" label
   - Fetches reports from backend on first click
   - Caches results for performance

**CSS Classes:**
- `.reports-dropdown-button` - Button styling
- `.reports-dropdown-menu` - Dropdown menu styling
- `.reports-menu-label` - Menu header
- `.no-reports-badge` - Badge styling

---

### **Handler: `handleViewLabReportsFromPrescription()`**

**Location:** `frontend/src/pages/PatientDashboard/PatientDashboard.jsx`

**Logic:**
1. Extract lab report IDs from prescription (prefer `labReportIds`, fallback to parsed `labReports`)
2. Check if reports already loaded in cache
3. For missing reports, fetch from backend using new API endpoint
4. Merge cached + fetched reports
5. Open related lab reports modal

**Smart Caching:**
```javascript
const available = allLabReports.filter(report => 
  labReportIds.includes(report.id)
);
const missingCount = labReportIds.filter(id => 
  !available.some(r => r.id === id)
).length;

if (missingCount > 0) {
  const fetched = await getLabReportsForPrescription(prescription.id);
  reports = [...available, ...fetched];
}
```

---

## 🔄 Data Flow

### **Prescription → Lab Reports Linkage**

```
1. Doctor creates prescription with selected lab reports
   ↓
2. System stores lab report IDs as CSV in prescription.labReports
   Example: "1,2,5"
   ↓
3. Backend extracts numeric IDs and populates prescription.labReportIds
   Example: [1, 2, 5]
   ↓
4. Frontend receives prescription with both fields
   - labReports: ["1", "2", "5"] (strings)
   - labReportIds: [1, 2, 5] (numbers)
   ↓
5. User clicks "Lab Reports" button on prescription card
   ↓
6. System fetches reports via:
   GET /patient/medical-records/prescriptions/{id}/lab-reports
   ↓
7. Reports loaded in modal with preview + download option
```

---

## 📊 Ownership & Security

**Patient Ownership Checks:**

1. **Lab Report Retrieval:**
   - Finds patient by JWT email
   - Verifies lab report belongs to patient
   - Returns 403 if not owned

2. **Prescription Linking:**
   - Verifies prescription belongs to patient
   - Validates all linked lab reports are patient's
   - Skips invalid/non-numeric IDs with logging

3. **Filtering:**
   - All filters scoped to patient's records
   - No cross-patient data leakage

---

## 🧪 Testing Checklist

### **Backend Testing**

- [ ] Start backend server in IntelliJ
- [ ] Verify logs show no errors
- [ ] Test each endpoint with valid JWT token
- [ ] Test invalid prescription ID (should return 403/404)
- [ ] Test pagination/filtering with various parameters

### **Frontend Testing**

- [ ] Navigate to Patient Dashboard > My Prescriptions
- [ ] Verify prescriptions with linked reports show "Lab Reports" button
- [ ] Click "Lab Reports" button
  - [ ] Dropdown appears
  - [ ] Backend logs show fetch request
  - [ ] Reports modal opens
- [ ] Click "View Full Report" in modal
  - [ ] Lab report preview renders
  - [ ] Results table displays correctly
  - [ ] Doctor notes visible
- [ ] Test filters (doctor, month, year, status)
- [ ] Test PDF download

### **Integration Testing**

- [ ] Create prescription with lab reports (doctor dashboard)
- [ ] Switch to patient account
- [ ] View prescription and related lab reports
- [ ] Verify all data matches doctor's input
- [ ] Test cross-patient isolation (shouldn't see other patients' data)

---

## 📝 Logging Reference

**Debug Logs:**
```
[DEBUG] Mapping prescription ID: X to DTO
[DEBUG] Mapped patient prescription DTO: prescriptionId=..., diagnosis=..., labReports=...
[DEBUG] Skipping non-numeric lab report reference on prescription X: invalid-id
```

**Info Logs:**
```
[INFO] Fetching lab reports for patient with email: X
[INFO] Found Y lab reports for patient ID: Z
[INFO] Fetching lab report ID: X for patient: Y
[INFO] Filtering lab reports - email: X, search: Y, doctor: Z...
[INFO] Found M lab reports matching filter criteria
```

**Error Logs:**
```
[ERROR] Patient not found with email: X
[ERROR] Lab report not found with ID: X
[ERROR] Lab report ID: X does not belong to patient ID: Y
```

---

## 🚀 Future Enhancements

1. **Bulk Report Downloads** - Download multiple lab reports as ZIP
2. **Report Sharing** - Share reports with family members
3. **Report History** - View previous versions of same test
4. **Automated Alerts** - Notify patient when abnormal results detected
5. **AI Insights** - Generate health insights from multiple reports

---

## 📞 Support

For issues or questions:
1. Check backend logs in IntelliJ
2. Verify JWT token is valid
3. Confirm patient email matches authentication
4. Review API response status codes
