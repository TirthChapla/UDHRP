import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import './PrescriptionModal.css';

function PrescriptionModal({ prescription, onClose, onDownload }) {
  const [zoom, setZoom] = useState(1);
  const [touchDistance, setTouchDistance] = useState(0);
  const documentRef = useRef(null);

  if (!prescription) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    onDownload(prescription);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.7));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Touch zoom functionality
  const getDistance = (touches) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setTouchDistance(getDistance(e.touches));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const scale = newDistance / touchDistance;
      setZoom(prev => Math.min(Math.max(prev * scale, 0.5), 2));
      setTouchDistance(newDistance);
    }
  };

  useEffect(() => {
    const element = documentRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [touchDistance]);

  // Calculate age from date of birth if provided
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="prescription-modal-overlay" onClick={handleOverlayClick}>
      <div className="prescription-paper" onClick={(e) => e.stopPropagation()}>
        {/* Action Buttons */}
        <div className="prescription-actions no-print">
          <div className="zoom-controls">
            <button className="action-btn zoom-btn" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <button className="action-btn zoom-reset" onClick={handleResetZoom} title="Reset Zoom">
              {Math.round(zoom * 100)}%
            </button>
            <button className="action-btn zoom-btn" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn size={18} />
            </button>
          </div>
          <button className="action-btn print-btn" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
          <button className="action-btn download-btn" onClick={handleDownload}>
            <FileText size={18} />
            Download PDF
          </button>
          <button className="action-btn close-btn" onClick={onClose}>
            <X size={18} />
            Close
          </button>
        </div>

        {/* Prescription Document */}
        <div className="prescription-scroll-container">
          <div 
            ref={documentRef}
            className="prescription-document"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
          {/* Header */}
          <div className="prescription-header">
            <div className="header-left">
              <h1 className="doctor-title">Doctor's</h1>
              <p className="medical-subtitle">Medical Prescription</p>
            </div>
            <div className="header-right">
              <div className="rx-symbol">℞</div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="doctor-info-box">
            <div className="info-inline-row">
              <span className="info-label-inline">Doctor Name:</span>
              <span className="info-value-inline">{prescription.doctorName || 'Dr. [Name]'}</span>
            </div>
            <div className="info-inline-row">
              <span className="info-label-inline">Reg. No:</span>
              <span className="info-value-inline">{prescription.doctorRegNo || 'MED-123456'}</span>
            </div>
            <div className="info-inline-row">
              <span className="info-label-inline">Specialization:</span>
              <span className="info-value-inline">{prescription.doctorSpecialization || 'Cardiologist'}</span>
            </div>
            <div className="info-inline-row">
              <span className="info-label-inline">Date:</span>
              <span className="info-value-inline">{new Date(prescription.date).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Patient Information */}
          <div className="patient-info-section">
            <h3 className="section-title">Patient Information</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-cell">Patient Name / Patient Id No / M.R No:</td>
                  <td className="value-cell">{prescription.patientName || 'John Doe'}</td>
                  <td className="label-cell">Date:</td>
                  <td className="value-cell">{new Date(prescription.date).toLocaleDateString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="label-cell">Date of Birth:</td>
                  <td className="value-cell">{prescription.patientDOB || '01/01/1990'}</td>
                  <td className="label-cell">Age:</td>
                  <td className="value-cell">{prescription.patientAge || calculateAge(prescription.patientDOB)}</td>
                </tr>
                <tr>
                  <td className="label-cell">Sex:</td>
                  <td className="value-cell">{prescription.patientSex || 'Male'}</td>
                  <td className="label-cell">Occupation:</td>
                  <td className="value-cell">{prescription.patientOccupation || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label-cell">Health Insurance No:</td>
                  <td className="value-cell">{prescription.insuranceNo || 'N/A'}</td>
                  <td className="label-cell">Health Care Provider:</td>
                  <td className="value-cell">{prescription.healthcareProvider || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label-cell">Health Card No:</td>
                  <td className="value-cell">{prescription.healthCardNo || 'N/A'}</td>
                  <td className="label-cell">Patient Id No:</td>
                  <td className="value-cell">{prescription.patientId || 'PAT-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</td>
                </tr>
                <tr>
                  <td className="label-cell">Patient's Address:</td>
                  <td className="value-cell">{prescription.patientAddress || 'N/A'}</td>
                  <td className="label-cell">Cell No:</td>
                  <td className="value-cell">{prescription.patientPhone || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label-cell">Diagnosed With:</td>
                  <td className="value-cell diagnosed-value" colSpan="3">{prescription.diagnosis}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vitals */}
          <div className="vitals-section">
            <table className="vitals-table">
              <tbody>
                <tr>
                  <td className="label-cell">Blood Pressure:</td>
                  <td className="value-cell">{prescription.vitals?.bloodPressure || '120/80'}</td>
                  <td className="label-cell">Pulse Rate:</td>
                  <td className="value-cell">{prescription.vitals?.pulseRate || '72 bpm'}</td>
                  <td className="label-cell">Height:</td>
                  <td className="value-cell">{prescription.vitals?.height || '170 cm'}</td>
                  <td className="label-cell">Weight:</td>
                  <td className="value-cell">{prescription.vitals?.weight || '70 kg'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Allergies */}
          <div className="allergies-section">
            <div className="label-cell">Allergies:</div>
            <div className="value-cell">{prescription.allergies || 'None'}</div>
          </div>

          {/* Prescription Section */}
          <div className="prescription-rx-section">
            <div className="prescription-title">Prescription:</div>
            <div className="prescription-text">
              {prescription.prescriptionNote || 'Take all medications as prescribed by the doctor. Follow the dosage instructions carefully.'}
            </div>
          </div>

          {/* Medications Table */}
          <div className="medications-section">
            <table className="medications-table">
              <thead>
                <tr>
                  <th>S.</th>
                  <th>Drugs</th>
                  <th>Unit (Tablet / Syrup)</th>
                  <th>Dosage (Per Day)</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medications && prescription.medications.length > 0 ? (
                  prescription.medications.map((med, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="drug-name">{med.name}</td>
                      <td>{med.unit || med.dosage || 'Tablet'}</td>
                      <td>{med.frequency || med.duration || '3 times'}</td>
                    </tr>
                  ))
                ) : (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Diet to Follow */}
          <div className="diet-section">
            <div className="label-cell">Diet To Follow:</div>
            <div className="value-cell diet-content">{prescription.diet || prescription.instructions || 'Regular balanced diet. Avoid oily and spicy food.'}</div>
          </div>

          {/* Brief History */}
          <div className="history-section">
            <div className="label-cell">Brief History of Patient:</div>
            <div className="value-cell history-content">{prescription.patientHistory || prescription.notes || 'Patient presented with symptoms as described above.'}</div>
          </div>

          {/* Follow Up */}
          <div className="followup-section">
            <div className="label-cell">Follow Up Provision:</div>
            <div className="value-cell">
              {prescription.followUp 
                ? (typeof prescription.followUp === 'string' && prescription.followUp.includes('-')
                    ? new Date(prescription.followUp).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                    : prescription.followUp)
                : 'After 1 week or as needed'}
            </div>
          </div>

          {/* Footer */}
          <div className="prescription-footer">
            <div className="footer-left">
              <div className="footer-text">Prescribed by Dr. {prescription.doctorName || '[Doctor Name]'}</div>
              <div className="footer-text">Contact: {prescription.doctorPhone || '+91-XXXXXXXXXX'}</div>
              <div className="footer-text">Clinic Address: {prescription.clinicAddress || '[Clinic Address]'}</div>
            </div>
            <div className="footer-right">
              <div className="signature-line">
                <div className="signature-label">Signature of Physician:</div>
                <div className="signature-box">
                  {prescription.doctorSignature && (
                    <img src={prescription.doctorSignature} alt="Doctor Signature" className="signature-img" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionModal;
