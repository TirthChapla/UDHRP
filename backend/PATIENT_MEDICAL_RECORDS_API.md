# Patient Medical Records API Endpoints

## Base URL
All endpoints use the base path: `/patient/medical-records`

## Authentication
All endpoints require JWT Bearer token authentication in the Authorization header.

---

## Prescriptions APIs

### Get All Prescriptions
**GET** `/patient/medical-records/prescriptions`

Retrieve all prescriptions for the authenticated patient.

**Response:**
```json
{
  "success": true,
  "message": "Prescriptions retrieved successfully",
  "data": [
    {
      "id": 1,
      "prescriptionId": "RX-2024-001",
      "date": "2024-01-15",
      "doctorId": "123",
      "doctorName": "Dr. John Smith",
      "doctorSpecialization": "General Medicine",
      "patientId": "456",
      "patientName": "Jane Doe",
      "diagnosis": "Common Cold",
      "symptoms": "Fever, Cough",
      "medications": [
        {
          "id": 1,
          "drug": "Paracetamol",
          "unit": "500mg",
          "dosage": "1-0-1",
          "duration": 5,
          "instructions": "Take after meals",
          "timing": "AFTER_FOOD"
        }
      ],
      "instructions": "Rest and drink plenty of fluids",
      "dietToFollow": "Light diet",
      "allergies": "None",
      "labReports": "CBC, Blood Sugar",
      "followUp": "Come for follow-up if symptoms persist",
      "followUpDate": "2024-01-22",
      "additionalNotes": "Patient recovering well",
      "createdAt": "2024-01-15T10:30:00"
    }
  ]
}
```

---

### Get Prescription by ID
**GET** `/patient/medical-records/prescriptions/{id}`

Retrieve a specific prescription by its ID.

**Path Parameters:**
- `id` (Long) - Prescription ID

**Response:**
Same as single prescription object from the list above.

---

### Get Doctors from Prescriptions
**GET** `/patient/medical-records/prescriptions/doctors`

Get a list of unique doctors who have treated the patient.

**Response:**
```json
{
  "success": true,
  "message": "Doctors list retrieved successfully",
  "data": ["Dr. John Smith", "Dr. Jane Wilson", "Dr. Robert Brown"]
}
```

---

### Get Years from Prescriptions
**GET** `/patient/medical-records/prescriptions/years`

Get a list of years with prescriptions (sorted descending).

**Response:**
```json
{
  "success": true,
  "message": "Years list retrieved successfully",
  "data": [2024, 2023, 2022]
}
```

---

### Filter Prescriptions
**GET** `/patient/medical-records/prescriptions/filter`

Filter prescriptions by multiple criteria.

**Query Parameters:**
- `search` (String, optional) - Search in doctor name, diagnosis, prescription ID
- `doctor` (String, optional) - Filter by doctor name
- `month` (Integer, optional) - Filter by month (1-12)
- `year` (Integer, optional) - Filter by year

**Example:**
```
GET /patient/medical-records/prescriptions/filter?search=cold&doctor=Dr. John Smith&month=1&year=2024
```

**Response:**
Same as Get All Prescriptions response.

---

## Lab Reports APIs

### Get All Lab Reports
**GET** `/patient/medical-records/lab-reports`

Retrieve all lab reports for the authenticated patient.

**Response:**
```json
{
  "success": true,
  "message": "Lab reports retrieved successfully",
  "data": [
    {
      "id": 1,
      "reportId": "LAB-1",
      "date": "2024-01-10",
      "testName": "Complete Blood Count",
      "status": "COMPLETED",
      "details": null,
      "results": "All parameters within normal range",
      "laboratoryName": "ABC Diagnostics",
      "doctorNotes": "Patient is healthy",
      "patientId": "456",
      "patientName": "Jane Doe",
      "doctorId": "123",
      "doctorName": "Dr. John Smith",
      "reportFilePath": "/reports/lab-1.pdf"
    }
  ]
}
```

---

### Get Lab Report by ID
**GET** `/patient/medical-records/lab-reports/{id}`

Retrieve a specific lab report by its ID.

**Path Parameters:**
- `id` (Long) - Lab Report ID

**Response:**
Same as single lab report object from the list above.

---

### Get Doctors from Lab Reports
**GET** `/patient/medical-records/lab-reports/doctors`

Get a list of unique doctors from lab reports.

**Response:**
```json
{
  "success": true,
  "message": "Doctors list retrieved successfully",
  "data": ["Dr. John Smith", "Dr. Jane Wilson"]
}
```

---

### Get Years from Lab Reports
**GET** `/patient/medical-records/lab-reports/years`

Get a list of years with lab reports (sorted descending).

**Response:**
```json
{
  "success": true,
  "message": "Years list retrieved successfully",
  "data": [2024, 2023, 2022]
}
```

---

### Filter Lab Reports
**GET** `/patient/medical-records/lab-reports/filter`

Filter lab reports by multiple criteria.

**Query Parameters:**
- `search` (String, optional) - Search in test name, lab name, doctor name, report ID
- `doctor` (String, optional) - Filter by doctor name
- `month` (Integer, optional) - Filter by month (1-12)
- `year` (Integer, optional) - Filter by year
- `status` (String, optional) - Filter by status (PENDING, COMPLETED, REVIEWED)

**Example:**
```
GET /patient/medical-records/lab-reports/filter?search=blood&status=COMPLETED&year=2024
```

**Response:**
Same as Get All Lab Reports response.

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Access denied to resource
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Logging

All endpoints include comprehensive logging:
- **INFO level**: Request initiated, success responses, record counts
- **DEBUG level**: Detailed filtering criteria, mapping operations
- **ERROR level**: Exceptions, resource not found errors
- **WARN level**: Date parsing failures

Example log entries:
```
INFO  - Fetching all prescriptions for patient: john.doe@example.com
INFO  - Retrieved 5 prescriptions for patient ID: 456
INFO  - Filtering prescriptions for patient: john.doe@example.com with search: cold, doctor: Dr. John Smith, month: 1, year: 2024
INFO  - Found 2 prescriptions matching filter criteria
DEBUG - Patient found: Jane Doe (ID: 456)
DEBUG - Mapping prescription ID: 1 to DTO
ERROR - Patient not found with email: invalid@example.com
WARN  - Could not parse date for month filter: invalid-date
```
