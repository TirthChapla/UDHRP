// patientService.js - All patient-related API calls
import { apiRequest } from './api';

// Mock data - Replace with actual API calls in production
const mockPrescriptions = [
  {
    id: 1,
    doctorName: 'Dr. Sarah Patel',
    doctorSpecialization: 'Cardiologist',
    date: '2025-12-15',
    time: '10:30 AM',
    preview: 'Prescribed medication for blood pressure management...',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' }
    ],
    diagnosis: 'Mild Hypertension',
    instructions: 'Take medications as prescribed. Monitor blood pressure daily. Reduce salt intake. Exercise regularly for 30 minutes daily.',
    followUp: '2026-01-15',
    labTests: ['Lipid Profile', 'ECG'],
    relatedLabReportIds: [2]
  },
  {
    id: 2,
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialization: 'General Physician',
    date: '2025-12-10',
    time: '2:15 PM',
    preview: 'Treatment for seasonal allergies and common cold...',
    medications: [
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily at night', duration: '7 days' },
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily after meals', duration: '5 days' }
    ],
    diagnosis: 'Seasonal Allergic Rhinitis with Viral Upper Respiratory Tract Infection',
    instructions: 'Stay hydrated. Avoid cold beverages. Rest adequately. Use steam inhalation twice daily.',
    followUp: 'If symptoms persist after 7 days',
    labTests: [],
    relatedLabReportIds: [1]
  },
  {
    id: 3,
    doctorName: 'Dr. Amit Sharma',
    doctorSpecialization: 'Orthopedic',
    date: '2025-11-28',
    time: '11:00 AM',
    preview: 'Follow-up consultation for knee pain treatment...',
    medications: [
      { name: 'Diclofenac', dosage: '50mg', frequency: 'Twice daily after meals', duration: '14 days' },
      { name: 'Calcium supplements', dosage: '500mg', frequency: 'Once daily', duration: '60 days' }
    ],
    diagnosis: 'Mild Osteoarthritis - Right Knee',
    instructions: 'Apply ice pack for 15 minutes twice daily. Avoid climbing stairs. Do prescribed physiotherapy exercises. Maintain healthy weight.',
    followUp: '2025-12-28',
    labTests: ['X-Ray - Right Knee'],
    relatedLabReportIds: [4]
  },
  {
    id: 4,
    doctorName: 'Dr. Sarah Patel',
    doctorSpecialization: 'Cardiologist',
    date: '2025-11-15',
    time: '09:45 AM',
    preview: 'Routine cardiovascular checkup and medication adjustment...',
    medications: [
      { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '30 days' },
      { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at night', duration: '30 days' }
    ],
    diagnosis: 'Controlled Hypertension with Dyslipidemia',
    instructions: 'Continue low-fat diet. Regular morning walks. Monitor cholesterol levels monthly.',
    followUp: '2025-12-15',
    labTests: ['Complete Lipid Profile', 'Liver Function Test'],
    relatedLabReportIds: [2, 5]
  },
  {
    id: 5,
    doctorName: 'Dr. Priya Menon',
    doctorSpecialization: 'Dermatologist',
    date: '2025-10-20',
    time: '3:30 PM',
    preview: 'Treatment for skin condition and acne...',
    medications: [
      { name: 'Adapalene Gel', dosage: '0.1%', frequency: 'Apply at night', duration: '60 days' },
      { name: 'Azithromycin', dosage: '500mg', frequency: 'Once daily', duration: '5 days' }
    ],
    diagnosis: 'Moderate Acne Vulgaris',
    instructions: 'Use oil-free moisturizer. Avoid direct sun exposure. Use sunscreen SPF 30+. Do not pop pimples.',
    followUp: '2025-11-20',
    labTests: [],
    relatedLabReportIds: [3]
  },
  {
    id: 6,
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialization: 'General Physician',
    date: '2025-09-15',
    time: '10:00 AM',
    preview: 'Annual health checkup and preventive care consultation...',
    medications: [
      { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Once daily', duration: '90 days' },
      { name: 'Vitamin D3', dosage: '60000 IU', frequency: 'Once weekly', duration: '8 weeks' }
    ],
    diagnosis: 'Vitamin D Deficiency',
    instructions: 'Get 15 minutes of morning sunlight daily. Include dairy products in diet. Regular exercise.',
    followUp: '2026-03-15',
    labTests: ['Complete Blood Count', 'Vitamin D Level', 'Thyroid Function Test'],
    relatedLabReportIds: [1, 3]
  }
];

/**
 * Fetch all prescriptions for a patient
 * @returns {Promise<Array>} Array of prescription objects
 */
export const getPrescriptions = async () => {
  try {
    console.log('[patientService] Fetching prescriptions from API');
    const response = await apiRequest('/patient/medical-records/prescriptions', 'GET');
    console.log('[patientService] Prescriptions received:', {
      count: response.data?.length || 0,
      firstPrescription: response.data?.[0] ? {
        id: response.data[0].id,
        prescriptionId: response.data[0].prescriptionId,
        diagnosis: response.data[0].diagnosis,
        symptoms: response.data[0].symptoms,
        dietToFollow: response.data[0].dietToFollow,
        instructions: response.data[0].instructions,
        labReports: response.data[0].labReports,
        medicationsCount: response.data[0].medications?.length
      } : null
    });
    return response.data || [];
  } catch (error) {
    console.error('[patientService] Error fetching prescriptions:', error);
    throw error;
  }
};

/**
 * Get unique doctors who have treated the patient
 * @returns {Promise<Array>} Array of unique doctor names
 */
export const getDoctorsFromPrescriptions = async () => {
  try {
    const response = await apiRequest('/patient/medical-records/prescriptions/doctors', 'GET');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching doctors from prescriptions:', error);
    throw error;
  }
};

/**
 * Get unique years from prescriptions
 * @returns {Promise<Array>} Array of years sorted descending
 */
export const getYearsFromPrescriptions = async () => {
  try {
    const response = await apiRequest('/patient/medical-records/prescriptions/years', 'GET');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching years from prescriptions:', error);
    throw error;
  }
};

/**
 * Filter prescriptions based on search and filter criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered prescriptions
 */
export const filterPrescriptions = async (filters) => {
  try {
    const { searchQuery, doctorName, month, year } = filters;
    
    const params = new URLSearchParams();
    if (searchQuery && searchQuery.trim()) params.append('search', searchQuery);
    if (doctorName && doctorName !== 'all') params.append('doctor', doctorName);
    if (month && month !== 'all') params.append('month', month);
    if (year && year !== 'all') params.append('year', year);
    
    const queryString = params.toString();
    const url = `/patient/medical-records/prescriptions/filter${queryString ? '?' + queryString : ''}`;
    
    const response = await apiRequest(url, 'GET');
    return response.data || [];
  } catch (error) {
    console.error('Error filtering prescriptions:', error);
    throw error;
  }
};

/**
 * Download prescription as PDF
 * @param {Object} prescription - Prescription object
 * @returns {Promise<void>}
 */
export const downloadPrescriptionPDF = async (prescription) => {
  try {
    // Create a temporary div with the prescription content
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${prescription.prescriptionId || prescription.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            padding: 15px;
            background: white;
            color: #000;
          }
          .prescription-document {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            position: relative;
          }
          
          /* Header Section */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #0ea5e9;
            padding-bottom: 12px;
            margin-bottom: 15px;
          }
          .header-left {
            flex: 1;
            text-align: left;
          }
          .clinic-logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            flex-shrink: 0;
          }
          .clinic-name {
            font-size: 22px;
            font-weight: bold;
            color: #0ea5e9;
            margin-bottom: 4px;
          }
          .doctor-name {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 2px;
          }
          .clinic-details {
            font-size: 11px;
            color: #64748b;
            line-height: 1.4;
          }
          
          /* Info Grid */
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-section {
            background: #f8fafc;
            padding: 10px;
            border-left: 3px solid #0ea5e9;
          }
          .info-section-title {
            font-size: 11px;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          .info-row {
            display: flex;
            margin-bottom: 5px;
            font-size: 12px;
          }
          .info-label {
            font-weight: 600;
            color: #475569;
            min-width: 100px;
          }
          .info-value {
            color: #1e293b;
          }
          
          /* Single Line Info */
          .inline-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            background: #fef3c7;
            border-left: 3px solid #f59e0b;
            margin-bottom: 15px;
            font-size: 12px;
          }
          .inline-info strong {
            color: #92400e;
            margin-right: 8px;
          }
          
          /* Section Headers */
          .section-header {
            font-size: 13px;
            font-weight: bold;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 15px 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          /* Diagnosis */
          .diagnosis-box {
            padding: 10px;
            background: #f1f5f9;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 12px;
            line-height: 1.6;
            color: #334155;
          }
          
          /* Medications Table */
          .medications-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 12px;
          }
          .medications-table thead {
            background: #0ea5e9;
            color: white;
          }
          .medications-table th {
            padding: 8px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }
          .medications-table td {
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          .medications-table tbody tr:hover {
            background: #f8fafc;
          }
          
          /* Clean Info Sections */
          .info-block {
            margin-bottom: 12px;
            padding: 10px;
            background: #f8fafc;
            border-left: 3px solid #cbd5e1;
            font-size: 12px;
          }
          .info-block-title {
            font-weight: bold;
            color: #475569;
            margin-bottom: 4px;
            font-size: 11px;
            text-transform: uppercase;
          }
          .info-block-content {
            color: #1e293b;
            line-height: 1.6;
          }
          
          /* Lab Reports */
          .lab-reports {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
          }
          .lab-tag {
            padding: 5px 12px;
            background: #dbeafe;
            color: #1e40af;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
          }
          
          /* Footer */
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .footer-note {
            font-size: 10px;
            color: #64748b;
            max-width: 60%;
            line-height: 1.4;
          }
          .signature-block {
            text-align: center;
          }
          .signature-line {
            width: 180px;
            border-top: 2px solid #000;
            margin-bottom: 5px;
            padding-top: 30px;
          }
          .signature-name {
            font-size: 12px;
            font-weight: bold;
            color: #1e293b;
          }
          .signature-reg {
            font-size: 10px;
            color: #64748b;
          }
          
          @media print {
            body {
              padding: 0;
            }
            .prescription-document {
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="prescription-document">
          <!-- Header with Logo -->
          <div class="header">
            <div class="header-left">
              <div class="clinic-name">${prescription.clinicName || 'Medical Clinic'}</div>
              <div class="doctor-name">${prescription.doctorName || 'Dr. Name'}, ${prescription.doctorDegree || 'MBBS, MD'}</div>
              <div class="clinic-details">
                ${prescription.clinicAddress || '123 Medical Street, City, State, ZIP'}<br>
                Phone: ${prescription.clinicPhone || '+91 1234567890'} | Reg. No.: ${prescription.doctorRegistration || 'REG123456'}
              </div>
            </div>
            <div class="clinic-logo">${(prescription.doctorName || 'Dr').charAt(0)}</div>
          </div>

          <!-- Patient & Date Info Grid -->
          <div class="info-grid">
            <div class="info-section">
              <div class="info-section-title">Patient Information</div>
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">${prescription.patientName || 'Sample Patient'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">ID:</span>
                <span class="info-value">${prescription.patientId || 'PAT001'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Age:</span>
                <span class="info-value">${prescription.age || '35'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Gender:</span>
                <span class="info-value">${prescription.gender || 'Male'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Contact:</span>
                <span class="info-value">${prescription.phone || '+91 9876543210'}</span>
              </div>
            </div>
            
            <div class="info-section">
              <div class="info-section-title">Visit Details</div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${prescription.date || new Date().toLocaleDateString('en-GB')}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Specialization:</span>
                <span class="info-value">${prescription.doctorSpecialization || 'General Physician'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">BP:</span>
                <span class="info-value">${prescription.bp || '-'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Weight:</span>
                <span class="info-value">${prescription.weight || '-'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Temperature:</span>
                <span class="info-value">${prescription.temperature || '-'}</span>
              </div>
            </div>
          </div>

          <!-- Allergies Alert -->
          ${prescription.allergies && prescription.allergies !== 'None' ? `
          <div class="inline-info">
            <div><strong>⚠ Allergies:</strong> ${prescription.allergies}</div>
          </div>
          ` : ''}

          <!-- Diagnosis -->
          <div class="section-header">Diagnosis</div>
          <div class="diagnosis-box">
            ${prescription.diagnosis || 'Sample Diagnosis'}
            ${prescription.symptoms ? '<br><br><strong>Symptoms:</strong> ' + prescription.symptoms : ''}
          </div>

          <!-- Medications -->
          <div class="section-header">Medications</div>
          <table class="medications-table">
            <thead>
              <tr>
                <th style="width: 40px;">S.No</th>
                <th>Medicine</th>
                <th style="width: 100px;">Dosage</th>
                <th style="width: 150px;">Frequency</th>
                <th style="width: 100px;">Duration</th>
              </tr>
            </thead>
            <tbody>
              ${(prescription.medications || []).map((med, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td><strong>${med.drug || med.name}</strong></td>
                  <td>${med.dosage || '-'}</td>
                  <td>${med.timing || med.frequency || '-'}</td>
                  <td>${med.duration || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Lab Reports Recommended -->
          ${prescription.labReports && prescription.labReports.length > 0 ? `
          <div class="section-header">Lab Reports Recommended</div>
          <div class="lab-reports">
            ${(Array.isArray(prescription.labReports) ? prescription.labReports : prescription.labReports.split(',')).map(lab => `
              <span class="lab-tag">🔬 ${lab.trim()}</span>
            `).join('')}
          </div>
          ` : ''}

          <!-- Diet to Follow -->
          ${prescription.dietToFollow || prescription.diet ? `
          <div class="info-block">
            <div class="info-block-title">🥗 Diet to Follow</div>
            <div class="info-block-content">${prescription.dietToFollow || prescription.diet}</div>
          </div>
          ` : ''}

          <!-- Instructions -->
          ${prescription.instructions || prescription.additionalNotes ? `
          <div class="info-block">
            <div class="info-block-title">📋 Instructions</div>
            <div class="info-block-content">${prescription.instructions || prescription.additionalNotes}</div>
          </div>
          ` : ''}

          <!-- Follow-up -->
          ${prescription.followUpDate || prescription.followUp ? `
          <div class="info-block" style="border-left-color: #10b981; background: #f0fdf4;">
            <div class="info-block-title" style="color: #065f46;">📅 Next Follow-up</div>
            <div class="info-block-content" style="font-weight: 600;">
              ${prescription.followUpDate ? new Date(prescription.followUpDate).toLocaleDateString('en-GB') : prescription.followUp}
            </div>
          </div>
          ` : ''}

          <!-- Footer -->
          <div class="footer">
            <div class="footer-note">
              * This is a digitally generated prescription<br>
              * Please bring this prescription for follow-up visits<br>
              * In case of emergency, contact: ${prescription.emergencyContact || prescription.clinicPhone || 'Clinic Number'}
            </div>
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">${prescription.doctorName || 'Dr. Name'}</div>
              <div class="signature-reg">${prescription.doctorDegree || 'MBBS, MD'}</div>
              <div class="signature-reg">Reg. No: ${prescription.doctorRegistration || 'REG123456'}</div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } catch (error) {
    console.error('Error downloading prescription:', error);
    throw error;
  }
};

// Lab Reports Mock Data
const mockLabReports = [
  {
    id: 1,
    testName: 'HAEMOGRAM REPORT',
    labName: 'Kansagara Unipath Specialty Laboratory LLP',
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialization: 'General Physician',
    date: '2025-12-20',
    time: '09:00 AM',
    status: 'completed',
    patientName: 'Patient Name',
    age: '20 Years',
    gender: 'Male',
    regNo: '5110050156',
    referredBy: 'SELF',
    teleNo: '9664966577',
    sampleType: 'EDTA Whole Blood',
    preview: 'All parameters within normal range. Hemoglobin: 14.5 g/dL, WBC: 7500...',
    results: [
      { parameter: 'Hemoglobin', value: '16.4', unit: 'g/dL', range: '13.0 - 17.0', status: 'normal' },
      { parameter: 'RBC Count', value: '5.11', unit: 'Mil /cu mm', range: '4.5 - 5.5', status: 'normal' },
      { parameter: 'Hematocrit (calculated)', value: '48.4', unit: '%', range: '40 - 50', status: 'normal' },
      { parameter: 'M.C.V.', value: '94.8', unit: 'fmto L', range: '83 - 101', status: 'normal' },
      { parameter: 'M.C.H.', value: '32.1', unit: 'pico gms', range: '27 - 32', status: 'high' },
      { parameter: 'MCHC', value: '33.9', unit: 'g/dL', range: '31.5 - 34.5', status: 'normal' },
      { parameter: 'RDW', value: '13.00', unit: '%', range: '11.5-14.5', status: 'normal' },
      { parameter: 'MCV/RBC Ratio', value: '19', unit: '', range: '>13', status: 'normal' },
      { parameter: 'Total WBC Count', value: '7960', unit: 'cells/cu mm', range: '4000 - 10000', status: 'normal' },
      { parameter: 'Neutrophils', value: '49.4', unit: '%', range: '38 - 70', status: 'normal' },
      { parameter: 'Lymphocytes', value: '33.7', unit: '%', range: '21 - 49', status: 'normal' },
      { parameter: 'Eosinophils', value: '7.2', unit: '%', range: '0 - 7', status: 'high' },
      { parameter: 'Monocytes', value: '9.6', unit: '%', range: '3 - 11', status: 'normal' },
      { parameter: 'Basophils', value: '0.1', unit: '%', range: '0 - 2', status: 'normal' },
      { parameter: 'Absolute Neutrophil Count', value: '3932', unit: '/cu mm', range: '1800 - 7700', status: 'normal' },
      { parameter: 'Absolute Lymphocyte Count', value: '2683', unit: '/cu mm', range: '1000 - 3900', status: 'normal' },
      { parameter: 'Absolute Eosinophil Count', value: '573', unit: '/cu mm', range: '20 - 500', status: 'high' },
      { parameter: 'Platelet Count', value: '303000', unit: '/cu mm', range: '150000 - 410000', status: 'normal' },
      { parameter: 'Immature platelet fraction', value: '1.1', unit: '%', range: '0 - 5', status: 'normal' },
      { parameter: 'M.P.V.', value: '8.30', unit: 'femto L', range: '6.5 - 12.0', status: 'normal' },
      { parameter: 'P.D.W.', value: '16.1', unit: 'femto L', range: '9 - 18', status: 'normal' },
      { parameter: 'Erythrocyte Sedimentation Rate(ESR)', value: '2', unit: 'mm/hr', range: '<15', status: 'normal' },
      { parameter: 'Reticulocytes % (Research)', value: '1.23', unit: '', range: '0.2 - 2.5', status: 'normal' }
    ],
    notes: 'All blood parameters are within normal limits. Continue regular health monitoring.'
  },
  {
    id: 2,
    testName: 'RANDOM PLASMA GLUCOSE',
    labName: 'Kansagara Unipath Specialty Laboratory LLP',
    doctorName: 'Dr. Sarah Patel',
    doctorSpecialization: 'Cardiologist',
    date: '2025-12-18',
    time: '08:30 AM',
    status: 'completed',
    patientName: 'Patient Name',
    age: '20 Years',
    gender: 'Male',
    regNo: '5110050157',
    referredBy: 'SELF',
    teleNo: '9664966577',
    sampleType: 'Fluoride plasma',
    preview: 'Random Plasma Glucose: 93.0 mg/dL...',
    results: [
      { parameter: 'Random Plasma Glucose', value: '93.0', unit: 'mg/dL', range: '>= 200 Suggestive of Diabetes', status: 'normal' }
    ],
    notes: 'If the patient Random Plasma Glucose value is >=200 mg/dL, Advise Oral Glucose Tolerance test(OGTT)for Further Evaluation.\n\nCriteria for the diagnosis of diabetes:\n1. HbA1c >= 6.5 %\n2. Fasting plasma glucose >=126 µmol/L. Fasting is defined as no caloric intake at least for 8 hrs.\n3. Two-hour plasma glucose >=200mg/dL during an oral glucose tolerance test by using a glucose load containing equivalent of 75 gm anhydrous glucose dissolved in water.\n4. In a patient with classic symptoms of hyperglycemia or hyperglycemic crisis, a random plasma glucose >=200 mg/dL "In the absence of unequivocal hyperglycemia, criteria 1-3 should be confirmed by Repeat testing." American Diabetes association, Standards of medical care in diabetes 2013; Diabetes care 2013;36:S11.'
  },
  {
    id: 3,
    testName: 'Lipid Profile',
    labName: 'Max Lab',
    doctorName: 'Dr. Sarah Patel',
    doctorSpecialization: 'Cardiologist',
    date: '2025-12-18',
    time: '08:30 AM',
    status: 'completed',
    patientName: 'Patient Name',
    age: '45 Years',
    gender: 'Female',
    regNo: '5110050158',
    referredBy: 'Dr. Sarah Patel',
    teleNo: '9876543210',
    sampleType: 'Serum',
    preview: 'Cholesterol levels slightly elevated. Total Cholesterol: 210 mg/dL...',
    results: [
      { parameter: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'high' },
      { parameter: 'LDL Cholesterol', value: '135', unit: 'mg/dL', range: '<100', status: 'high' },
      { parameter: 'HDL Cholesterol', value: '45', unit: 'mg/dL', range: '>40', status: 'normal' },
      { parameter: 'Triglycerides', value: '150', unit: 'mg/dL', range: '<150', status: 'normal' }
    ],
    notes: 'Cholesterol levels are slightly elevated. Recommend lifestyle modifications and follow-up in 3 months.'
  },
  {
    id: 4,
    testName: 'Thyroid Function Test',
    labName: 'Metropolis Healthcare',
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialization: 'General Physician',
    date: '2025-12-10',
    time: '10:00 AM',
    status: 'completed',
    patientName: 'Patient Name',
    age: '35 Years',
    gender: 'Female',
    regNo: '5110050159',
    referredBy: 'SELF',
    teleNo: '9876543211',
    sampleType: 'Serum',
    preview: 'Thyroid function normal. TSH: 2.5 mIU/L, T3 and T4 within range...',
    results: [
      { parameter: 'TSH', value: '2.5', unit: 'mIU/L', range: '0.4-4.0', status: 'normal' },
      { parameter: 'T3', value: '1.2', unit: 'ng/mL', range: '0.8-2.0', status: 'normal' },
      { parameter: 'T4', value: '8.5', unit: 'μg/dL', range: '5.0-12.0', status: 'normal' }
    ],
    notes: 'Thyroid function is normal. No medication required at this time.'
  },
  {
    id: 5,
    testName: 'HbA1c (Diabetes)',
    labName: 'Apollo Diagnostics',
    doctorName: 'Dr. Amit Sharma',
    doctorSpecialization: 'Endocrinologist',
    date: '2025-11-25',
    time: '09:30 AM',
    status: 'completed',
    preview: 'Blood sugar control is good. HbA1c: 5.8%...',
    results: [
      { parameter: 'HbA1c', value: '5.8', unit: '%', range: '<5.7', status: 'borderline' },
      { parameter: 'Fasting Glucose', value: '105', unit: 'mg/dL', range: '70-100', status: 'borderline' }
    ],
    notes: 'Pre-diabetic range. Recommend dietary changes and regular exercise. Retest in 3 months.'
  },
  {
    id: 6,
    testName: 'Liver Function Test',
    labName: 'Max Lab',
    doctorName: 'Dr. Sarah Patel',
    doctorSpecialization: 'Cardiologist',
    date: '2025-11-20',
    time: '08:00 AM',
    status: 'completed',
    preview: 'Liver enzymes within normal range. SGOT: 28 U/L, SGPT: 32 U/L...',
    results: [
      { parameter: 'SGOT (AST)', value: '28', unit: 'U/L', range: '<40', status: 'normal' },
      { parameter: 'SGPT (ALT)', value: '32', unit: 'U/L', range: '<40', status: 'normal' },
      { parameter: 'Bilirubin Total', value: '0.8', unit: 'mg/dL', range: '0.3-1.2', status: 'normal' },
      { parameter: 'Alkaline Phosphatase', value: '95', unit: 'U/L', range: '30-120', status: 'normal' }
    ],
    notes: 'Liver function is normal. Continue current medications as prescribed.'
  },
  {
    id: 7,
    testName: 'Vitamin D Level',
    labName: 'Metropolis Healthcare',
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialization: 'General Physician',
    date: '2025-09-15',
    time: '11:00 AM',
    status: 'completed',
    preview: 'Vitamin D deficiency detected. Level: 18 ng/mL...',
    results: [
      { parameter: 'Vitamin D (25-OH)', value: '18', unit: 'ng/mL', range: '30-100', status: 'low' }
    ],
    notes: 'Vitamin D deficiency. Started on supplements. Increase sun exposure. Retest after 8 weeks.'
  },
  {
    id: 8,
    testName: 'Kidney Function Test (KFT)',
    labName: 'Apollo Diagnostics',
    doctorName: 'Dr. Amit Sharma',
    doctorSpecialization: 'Nephrologist',
    date: '2025-12-22',
    time: '07:30 AM',
    status: 'completed',
    preview: 'Kidney function normal. Creatinine: 0.9 mg/dL, BUN: 15 mg/dL...',
    results: [
      { parameter: 'Creatinine', value: '0.9', unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
      { parameter: 'Blood Urea Nitrogen (BUN)', value: '15', unit: 'mg/dL', range: '7-20', status: 'normal' },
      { parameter: 'Uric Acid', value: '5.2', unit: 'mg/dL', range: '3.5-7.2', status: 'normal' },
      { parameter: 'Sodium', value: '140', unit: 'mEq/L', range: '136-145', status: 'normal' },
      { parameter: 'Potassium', value: '4.2', unit: 'mEq/L', range: '3.5-5.0', status: 'normal' }
    ],
    notes: 'Excellent kidney function. All electrolytes balanced. Continue current lifestyle and hydration.'
  },
  {
    id: 9,
    testName: 'Urine Routine & Microscopy',
    labName: 'Max Lab',
    doctorName: 'Dr. Priya Menon',
    doctorSpecialization: 'Urologist',
    date: '2025-12-19',
    time: '08:15 AM',
    status: 'completed',
    preview: 'Urine analysis shows normal results. No infection detected...',
    results: [
      { parameter: 'Color', value: 'Pale Yellow', unit: '', range: 'Pale Yellow', status: 'normal' },
      { parameter: 'pH', value: '6.0', unit: '', range: '5.0-7.0', status: 'normal' },
      { parameter: 'Specific Gravity', value: '1.020', unit: '', range: '1.010-1.025', status: 'normal' },
      { parameter: 'Protein', value: 'Nil', unit: '', range: 'Nil', status: 'normal' },
      { parameter: 'Glucose', value: 'Nil', unit: '', range: 'Nil', status: 'normal' },
      { parameter: 'WBC', value: '2-3', unit: '/HPF', range: '0-5', status: 'normal' },
      { parameter: 'RBC', value: '0-1', unit: '/HPF', range: '0-2', status: 'normal' }
    ],
    notes: 'Normal urine analysis. No signs of infection or kidney disease. Stay well hydrated.'
  },
  {
    id: 10,
    testName: 'Iron Studies Panel',
    labName: 'Metropolis Healthcare',
    doctorName: 'Dr. Sarah Patel',
    doctorSpecialization: 'Hematologist',
    date: '2025-12-16',
    time: '09:45 AM',
    status: 'completed',
    preview: 'Iron levels are low. Serum Iron: 45 μg/dL, Ferritin: 18 ng/mL...',
    results: [
      { parameter: 'Serum Iron', value: '45', unit: 'μg/dL', range: '60-170', status: 'low' },
      { parameter: 'Ferritin', value: '18', unit: 'ng/mL', range: '30-300', status: 'low' },
      { parameter: 'TIBC', value: '420', unit: 'μg/dL', range: '250-450', status: 'normal' },
      { parameter: 'Transferrin Saturation', value: '12', unit: '%', range: '20-50', status: 'low' }
    ],
    notes: 'Iron deficiency anemia detected. Started on iron supplements. Include iron-rich foods in diet. Follow-up in 6 weeks.'
  },
  {
    id: 11,
    testName: 'COVID-19 RT-PCR',
    labName: 'Apollo Diagnostics',
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialization: 'General Physician',
    date: '2025-12-14',
    time: '10:30 AM',
    status: 'completed',
    preview: 'COVID-19 test result: NEGATIVE...',
    results: [
      { parameter: 'SARS-CoV-2 RNA', value: 'Not Detected', unit: '', range: 'Not Detected', status: 'normal' },
      { parameter: 'CT Value (E Gene)', value: 'N/A', unit: '', range: 'N/A', status: 'normal' }
    ],
    notes: 'No COVID-19 infection detected. Continue following safety guidelines and maintain hygiene.'
  },
  {
    id: 12,
    testName: 'Allergy Panel - Food',
    labName: 'Max Lab',
    doctorName: 'Dr. Priya Menon',
    doctorSpecialization: 'Allergist',
    date: '2025-12-08',
    time: '11:15 AM',
    status: 'completed',
    preview: 'Moderate allergy to peanuts and shellfish detected...',
    results: [
      { parameter: 'Peanuts IgE', value: '3.5', unit: 'kU/L', range: '<0.35', status: 'high' },
      { parameter: 'Shellfish IgE', value: '2.8', unit: 'kU/L', range: '<0.35', status: 'high' },
      { parameter: 'Milk IgE', value: '0.12', unit: 'kU/L', range: '<0.35', status: 'normal' },
      { parameter: 'Wheat IgE', value: '0.08', unit: 'kU/L', range: '<0.35', status: 'normal' },
      { parameter: 'Egg IgE', value: '0.15', unit: 'kU/L', range: '<0.35', status: 'normal' }
    ],
    notes: 'Moderate allergic response to peanuts and shellfish. Strict avoidance recommended. Carry emergency epinephrine.'
  },
  {
    id: 12,
    testName: 'Electrocardiogram (ECG)',
    labName: 'Apollo Diagnostics',
    doctorName: 'Dr. Sarah Patel',
    doctorSpecialization: 'Cardiologist',
    date: '2025-12-05',
    time: '02:00 PM',
    status: 'completed',
    preview: 'ECG shows normal sinus rhythm. Heart rate: 72 bpm...',
    results: [
      { parameter: 'Heart Rate', value: '72', unit: 'bpm', range: '60-100', status: 'normal' },
      { parameter: 'PR Interval', value: '160', unit: 'ms', range: '120-200', status: 'normal' },
      { parameter: 'QRS Duration', value: '90', unit: 'ms', range: '80-120', status: 'normal' },
      { parameter: 'QT Interval', value: '400', unit: 'ms', range: '350-450', status: 'normal' },
      { parameter: 'Rhythm', value: 'Normal Sinus', unit: '', range: 'Normal Sinus', status: 'normal' }
    ],
    notes: 'Normal ECG findings. No signs of cardiac abnormalities. Continue regular checkups as scheduled.'
  },
  {
    id: 13,
    testName: 'Prostate-Specific Antigen (PSA)',
    labName: 'Metropolis Healthcare',
    doctorName: 'Dr. Amit Sharma',
    doctorSpecialization: 'Urologist',
    date: '2025-11-30',
    time: '08:45 AM',
    status: 'completed',
    preview: 'PSA levels within normal range for age. Total PSA: 1.2 ng/mL...',
    results: [
      { parameter: 'Total PSA', value: '1.2', unit: 'ng/mL', range: '<4.0', status: 'normal' },
      { parameter: 'Free PSA', value: '0.3', unit: 'ng/mL', range: '0.2-0.5', status: 'normal' },
      { parameter: 'Free/Total Ratio', value: '25', unit: '%', range: '>15', status: 'normal' }
    ],
    notes: 'PSA levels are normal. No indication of prostate issues. Recommended annual screening.'
  },
  {
    id: 14,
    testName: 'X-Ray Chest (PA View)',
    labName: 'Max Lab',
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialization: 'Pulmonologist',
    date: '2025-11-22',
    time: '03:30 PM',
    status: 'completed',
    preview: 'Chest X-ray shows clear lung fields. No abnormalities detected...',
    results: [
      { parameter: 'Lung Fields', value: 'Clear', unit: '', range: 'Clear', status: 'normal' },
      { parameter: 'Heart Size', value: 'Normal', unit: '', range: 'Normal', status: 'normal' },
      { parameter: 'Mediastinum', value: 'Normal', unit: '', range: 'Normal', status: 'normal' },
      { parameter: 'Pleura', value: 'No effusion', unit: '', range: 'No effusion', status: 'normal' },
      { parameter: 'Bones', value: 'Normal', unit: '', range: 'Normal', status: 'normal' }
    ],
    notes: 'Normal chest X-ray. No signs of infection, masses, or abnormalities. Respiratory system healthy.'
  },
  {
    id: 15,
    testName: 'Stool Routine Examination',
    labName: 'Apollo Diagnostics',
    doctorName: 'Dr. Priya Menon',
    doctorSpecialization: 'Gastroenterologist',
    date: '2025-11-18',
    time: '09:00 AM',
    status: 'pending',
    preview: 'Test in progress. Results will be available soon...',
    results: [],
    notes: 'Sample received. Processing in laboratory. Results expected within 24 hours.'
  }
];

/**
 * Get all lab reports for a patient
 * @returns {Promise<Array>}
 * NOTE: Lab reports functionality is skipped for now
 */
export const getLabReports = async () => {
  try {
    // TODO: Implement when lab reports are required
    return [];
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    throw error;
  }
};

/**
 * Filter lab reports based on criteria
 * @param {Object} filters 
 * @returns {Promise<Array>}
 * NOTE: Lab reports functionality is skipped for now
 */
export const filterLabReports = async (filters) => {
  try {
    // TODO: Implement when lab reports are required
    return [];
  } catch (error) {
    console.error('Error filtering lab reports:', error);
    throw error;
  }
};

/**
 * Get unique doctors from lab reports
 * @returns {Promise<Array>}
 * NOTE: Lab reports functionality is skipped for now
 */
export const getDoctorsFromLabReports = async () => {
  try {
    // TODO: Implement when lab reports are required
    return [];
  } catch (error) {
    console.error('Error fetching doctors from lab reports:', error);
    throw error;
  }
};

/**
 * Get unique years from lab reports
 * @returns {Promise<Array>}
 * NOTE: Lab reports functionality is skipped for now
 */
export const getYearsFromLabReports = async () => {
  try {
    // TODO: Implement when lab reports are required
    return [];
  } catch (error) {
    console.error('Error fetching years from lab reports:', error);
    throw error;
  }
};

/**
 * Download lab report PDF
 * @param {Object} report 
 * @returns {Promise<void>}
 */
export const downloadLabReportPDF = async (report) => {
  try {
    console.log('Downloading lab report:', report.id);
    alert('PDF download will be implemented with backend integration');
  } catch (error) {    console.error('Error downloading prescription:', error);
    throw error;
  }
};

// ========================
// PATIENT PROFILE APIs
// ========================

/**
 * Get patient profile
 * @returns {Promise<Object>}
 */
export const getPatientProfile = async () => {
  try {
    const response = await apiRequest('/patient/profile', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    throw error;
  }
};

/**
 * Update patient profile
 * @param {Object} profileData 
 * @returns {Promise<Object>}
 */
export const updatePatientProfile = async (profileData) => {
  try {
    const response = await apiRequest('/patient/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating patient profile:', error);
    throw error;
  }
};

// ========================
// FIND DOCTOR APIs
// ========================

/**
 * Get all doctors
 * @returns {Promise<Array>}
 */
export const getAllDoctors = async () => {
  try {
    const response = await apiRequest('/patient/doctors', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all doctors:', error);
    throw error;
  }
};

/**
 * Get available doctors
 * @returns {Promise<Array>}
 */
export const getAvailableDoctors = async () => {
  try {
    const response = await apiRequest('/patient/doctors/available', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available doctors:', error);
    throw error;
  }
};

/**
 * Search doctors with filters
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query (name, specialization, hospital)
 * @param {string} params.specialization - Filter by specialization
 * @param {string} params.city - Filter by city
 * @returns {Promise<Array>}
 */
export const searchDoctors = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.specialization) queryParams.append('specialization', params.specialization);
    if (params.city) queryParams.append('city', params.city);
    
    const queryString = queryParams.toString();
    const endpoint = `/patient/doctors/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest(endpoint, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
};

/**
 * Get doctors by specialization
 * @param {string} specialization 
 * @returns {Promise<Array>}
 */
export const getDoctorsBySpecialization = async (specialization) => {
  try {
    const response = await apiRequest(`/patient/doctors/specialization/${encodeURIComponent(specialization)}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors by specialization:', error);
    throw error;
  }
};

/**
 * Get doctor by ID
 * @param {number|string} doctorId 
 * @returns {Promise<Object>}
 */
export const getDoctorById = async (doctorId) => {
  try {
    const response = await apiRequest(`/patient/doctors/${doctorId}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    throw error;
  }
};

/**
 * Get all available specializations
 * @returns {Promise<Array>}
 */
export const getSpecializations = async () => {
  try {
    const response = await apiRequest('/patient/doctors/specializations', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching specializations:', error);
    throw error;
  }
};

/**
 * Get all available cities
 * @returns {Promise<Array>}
 */
export const getCities = async () => {
  try {
    const response = await apiRequest('/patient/doctors/cities', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

// ========================
// APPOINTMENT APIs
// ========================

/**
 * Book an appointment with a doctor
 * @param {Object} appointmentData - Appointment details
 * @param {number} appointmentData.doctorId - Doctor ID
 * @param {string} appointmentData.date - Date in yyyy-MM-dd format
 * @param {string} appointmentData.time - Time in HH:mm format
 * @param {string} appointmentData.type - Appointment type (IN_PERSON, VIDEO_CALL, PHONE_CALL)
 * @param {string} appointmentData.reason - Reason for appointment
 * @param {string} appointmentData.notes - Additional notes
 * @returns {Promise<Object>}
 */
export const bookAppointment = async (appointmentData) => {
  try {
    console.log('Sending appointment request:', appointmentData);
    const response = await apiRequest('/patient/appointments/book', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    console.log('Appointment response:', response);
    return response.data;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

/**
 * Get all appointments for the patient
 * @returns {Promise<Array>}
 */
export const getPatientAppointments = async () => {
  try {
    const response = await apiRequest('/patient/appointments', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Get upcoming appointments for the patient
 * @returns {Promise<Array>}
 */
export const getUpcomingAppointments = async () => {
  try {
    const response = await apiRequest('/patient/appointments/upcoming', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    throw error;
  }
};

/**
 * Get appointment by ID
 * @param {number} appointmentId 
 * @returns {Promise<Object>}
 */
export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await apiRequest(`/patient/appointments/${appointmentId}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param {number} appointmentId 
 * @returns {Promise<Object>}
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await apiRequest(`/patient/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};
