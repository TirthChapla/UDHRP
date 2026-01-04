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
 * @param {string} patientId - The patient's ID
 * @returns {Promise<Array>} Array of prescription objects
 */
export const getPrescriptions = async (patientId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/patients/${patientId}/prescriptions`);
    // const data = await response.json();
    // return data;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPrescriptions;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
};

/**
 * Get unique doctors who have treated the patient
 * @param {Array} prescriptions - Array of prescriptions
 * @returns {Array} Array of unique doctor names
 */
export const getDoctorsFromPrescriptions = (prescriptions) => {
  return [...new Set(prescriptions.map(p => p.doctorName))];
};

/**
 * Get unique years from prescriptions
 * @param {Array} prescriptions - Array of prescriptions
 * @returns {Array} Array of years sorted descending
 */
export const getYearsFromPrescriptions = (prescriptions) => {
  return [...new Set(prescriptions.map(p => new Date(p.date).getFullYear()))]
    .sort((a, b) => b - a);
};

/**
 * Filter prescriptions based on search and filter criteria
 * @param {Array} prescriptions - Array of all prescriptions
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered prescriptions
 */
export const filterPrescriptions = (prescriptions, filters) => {
  const { searchQuery, doctorName, month, year } = filters;

  return prescriptions.filter(prescription => {
    const matchesSearch = !searchQuery || 
      prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDoctor = doctorName === 'all' || prescription.doctorName === doctorName;
    
    const prescriptionDate = new Date(prescription.date);
    const matchesMonth = month === 'all' || prescriptionDate.getMonth() + 1 === parseInt(month);
    const matchesYear = year === 'all' || prescriptionDate.getFullYear() === parseInt(year);
    
    return matchesSearch && matchesDoctor && matchesMonth && matchesYear;
  });
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
        <title>Prescription - ${prescription.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: white;
          }
          .prescription-document {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            border: 3px solid #2563eb;
            background: white;
          }
          .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
          }
          .clinic-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
          }
          .clinic-info {
            font-size: 12px;
            color: #666;
          }
          .doctor-info {
            margin-bottom: 20px;
            padding: 12px;
            background: #f8f9fa;
          }
          .info-row {
            display: flex;
            padding: 6px 0;
          }
          .info-label {
            font-weight: bold;
            font-size: 14px;
            min-width: 150px;
          }
          .info-value {
            font-size: 14px;
          }
          .patient-info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .patient-info-table td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 13px;
          }
          .label-cell {
            font-weight: bold;
            background: #f8f9fa;
            width: 120px;
          }
          .section-title {
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
          }
          .prescription-section {
            margin-bottom: 20px;
            padding: 12px;
            border-bottom: 2px solid #e5e7eb;
          }
          .prescription-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .prescription-text {
            font-size: 14px;
            line-height: 1.6;
          }
          .medications-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .medications-table th,
          .medications-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            font-size: 13px;
          }
          .medications-table th {
            background: #f8f9fa;
            font-weight: bold;
          }
          .section-content {
            padding: 12px;
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 12px;
          }
          .section-content .label-cell {
            font-weight: bold;
            margin-bottom: 8px;
          }
          .section-content .value-cell {
            line-height: 1.6;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #000;
          }
          .signature-section {
            text-align: right;
            margin-top: 60px;
          }
          .signature-line {
            border-top: 1px solid #000;
            width: 200px;
            margin-left: auto;
            margin-top: 50px;
            padding-top: 5px;
            text-align: center;
            font-size: 12px;
          }
          @media print {
            body {
              padding: 0;
            }
            .prescription-document {
              border: 3px solid #2563eb;
            }
          }
        </style>
      </head>
      <body>
        <div class="prescription-document">
          <!-- Header -->
          <div class="header">
            <div class="clinic-name">${prescription.doctorClinic || 'Medical Clinic'}</div>
            <div class="clinic-info">${prescription.doctorAddress || 'Medical District, City'}</div>
            <div class="clinic-info">Phone: ${prescription.doctorPhone || '+91 1234567890'}</div>
          </div>

          <!-- Doctor Information -->
          <div class="doctor-info">
            <div class="info-row">
              <span class="info-label">Doctor Name:</span>
              <span class="info-value">${prescription.doctorName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Specialization:</span>
              <span class="info-value">${prescription.doctorSpecialization}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Registration No:</span>
              <span class="info-value">${prescription.doctorRegistration || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${prescription.date}</span>
            </div>
          </div>

          <!-- Patient Information -->
          <table class="patient-info-table">
            <tr>
              <td class="label-cell">Patient Name:</td>
              <td>${prescription.patientName}</td>
              <td class="label-cell">Age:</td>
              <td>${prescription.age} years</td>
            </tr>
            <tr>
              <td class="label-cell">Gender:</td>
              <td>${prescription.gender}</td>
              <td class="label-cell">Cell No:</td>
              <td>${prescription.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label-cell">Weight:</td>
              <td>${prescription.weight || 'N/A'}</td>
              <td class="label-cell">BP:</td>
              <td>${prescription.bp || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label-cell" colspan="4">Allergies:</td>
            </tr>
            <tr>
              <td colspan="4">${prescription.allergies || 'None'}</td>
            </tr>
            <tr>
              <td class="label-cell" colspan="4">Patient's Address:</td>
            </tr>
            <tr>
              <td colspan="4">${prescription.address || 'N/A'}</td>
            </tr>
          </table>

          <!-- Prescription -->
          <div class="prescription-section">
            <div class="prescription-title">Prescription:</div>
            <div class="prescription-text">${prescription.prescriptionNote || 'Take all medications as prescribed by the doctor. Follow the dosage instructions carefully.'}</div>
          </div>

          <!-- Medications -->
          <div class="section-title">Medications</div>
          <table class="medications-table">
            <thead>
              <tr>
                <th style="width: 60px;">S.</th>
                <th>Drugs</th>
                <th style="width: 100px;">Unit</th>
                <th style="width: 200px;">Dosage</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.medications.map((med, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${med.name}</td>
                  <td>${med.unit}</td>
                  <td>${med.dosage}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Diet To Follow -->
          <div class="section-content">
            <div class="label-cell">Diet To Follow:</div>
            <div class="value-cell">${prescription.diet || 'Maintain a balanced diet'}</div>
          </div>

          <!-- History -->
          <div class="section-content">
            <div class="label-cell">History:</div>
            <div class="value-cell">${prescription.history || 'No significant medical history'}</div>
          </div>

          <!-- Follow-up -->
          <div class="section-content">
            <div class="label-cell">Follow-up:</div>
            <div class="value-cell">${prescription.followUp || 'Follow up after 1 week'}</div>
          </div>

          <!-- Footer with Signature -->
          <div class="footer">
            <div class="signature-section">
              <div class="signature-line">Doctor's Signature</div>
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
 * @param {string} patientId 
 * @returns {Promise<Array>}
 */
export const getLabReports = async (patientId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLabReports);
    }, 500);
  });
};

/**
 * Filter lab reports based on criteria
 * @param {Array} reports 
 * @param {Object} filters 
 * @returns {Array}
 */
export const filterLabReports = (reports, filters) => {
  return reports.filter(report => {
    const matchesSearch = !filters.searchQuery || 
      report.testName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      report.labName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      report.doctorName.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesDoctor = filters.doctorName === 'all' || 
      report.doctorName === filters.doctorName;
    
    const reportDate = new Date(report.date);
    const matchesMonth = filters.month === 'all' || 
      (reportDate.getMonth() + 1) === parseInt(filters.month);
    
    const matchesYear = filters.year === 'all' || 
      reportDate.getFullYear() === parseInt(filters.year);
    
    const matchesStatus = filters.status === 'all' ||
      report.status === filters.status;
    
    return matchesSearch && matchesDoctor && matchesMonth && matchesYear && matchesStatus;
  });
};

/**
 * Get unique doctors from lab reports
 * @param {Array} reports 
 * @returns {Array}
 */
export const getDoctorsFromLabReports = (reports) => {
  const doctors = new Set(reports.map(r => r.doctorName));
  return Array.from(doctors);
};

/**
 * Get unique years from lab reports
 * @param {Array} reports 
 * @returns {Array}
 */
export const getYearsFromLabReports = (reports) => {
  const years = new Set(reports.map(r => new Date(r.date).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
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
