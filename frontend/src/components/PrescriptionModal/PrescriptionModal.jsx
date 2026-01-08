import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import './PrescriptionModal.css';

function PrescriptionModal({ prescription, onClose, onDownload }) {
  const [zoom, setZoom] = useState(1);
  const [touchDistance, setTouchDistance] = useState(0);
  const documentRef = useRef(null);

  if (!prescription) return null;

  // Log prescription data for debugging
  console.log('[PrescriptionModal] Rendering prescription:', {
    id: prescription.id,
    prescriptionId: prescription.prescriptionId,
    diagnosis: prescription.diagnosis,
    symptoms: prescription.symptoms,
    dietToFollow: prescription.dietToFollow,
    instructions: prescription.instructions,
    labReports: prescription.labReports,
    medications: prescription.medications,
    followUpDate: prescription.followUpDate
  });

  // Helper function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
            className="prescription-document-new"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
          {/* Header with Logo */}
          <div className="header-new">
            <div className="header-left-new">
              <div className="clinic-name-new">{prescription.clinicName || 'Medical Clinic'}</div>
              <div className="doctor-name-new">{prescription.doctorName || 'Dr. Name'}, {prescription.doctorDegree || 'MBBS, MD'}</div>
              <div className="clinic-details-new">
                {prescription.clinicAddress || '123 Medical Street, City, State, ZIP'}<br />
                Phone: {prescription.clinicPhone || '+91 1234567890'} | Reg. No.: {prescription.doctorRegistration || 'REG123456'}
              </div>
            </div>
            <div className="clinic-logo-new">{(prescription.doctorName || 'Dr').charAt(0)}</div>
          </div>

          {/* Date Info */}
          <div className="date-info-new">
            <span className="date-label-new">Date:</span>
            <span className="date-value-new">{new Date(prescription.date).toLocaleDateString('en-GB')}</span>
          </div>

          {/* Allergies Alert */}
          {prescription.allergies && prescription.allergies !== 'None' && (
            <div className="inline-info-new">
              <div><strong>⚠ Allergies:</strong> {prescription.allergies}</div>
            </div>
          )}

          {/* Diagnosis */}
          <div className="section-header-new">🩺 Diagnosis</div>
          <div className="diagnosis-box-new">
            {prescription.diagnosis || 'N/A'}
            {prescription.symptoms && (
              <>
                <br /><br /><strong>Symptoms:</strong> {prescription.symptoms}
              </>
            )}
          </div>

          {/* Medications */}
          <div className="section-header-new">💊 Medications</div>
          <table className="medications-table-new">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>S.No</th>
                <th>Medicine</th>
                <th style={{ width: '120px' }}>Unit (Tablet/Syrup)</th>
                <th style={{ width: '180px' }}>Dosage (Per Day)</th>
                <th style={{ width: '100px' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medications && prescription.medications.length > 0 ? (
                prescription.medications.map((med, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td><strong>{med.drug || med.name}</strong></td>
                    <td>{med.unit || '-'}</td>
                    <td>{med.dosage || med.timing || med.frequency || '-'}</td>
                    <td>{med.duration ? `${med.duration} days` : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No medications prescribed</td></tr>
              )}
            </tbody>
          </table>

          {/* Lab Reports Recommended */}
          {prescription.labReports && prescription.labReports.length > 0 && (
            <>
              <div className="section-header-new">🔬 Lab Reports Recommended</div>
              <div className="lab-reports-new">
                {(Array.isArray(prescription.labReports) ? prescription.labReports : prescription.labReports.split(',')).map((lab, i) => (
                  <span key={i} className="lab-tag-new">🔬 {lab.trim()}</span>
                ))}
              </div>
            </>
          )}

          {/* Diet to Follow */}
          {(prescription.dietToFollow || prescription.diet) && (
            <div className="info-block-new">
              <div className="info-block-title-new">🥗 Diet to Follow</div>
              <div className="info-block-content-new">{prescription.dietToFollow || prescription.diet}</div>
            </div>
          )}

          {/* Instructions */}
          {(prescription.instructions || prescription.additionalNotes) && (
            <div className="info-block-new">
              <div className="info-block-title-new">📋 Instructions</div>
              <div className="info-block-content-new">{prescription.instructions || prescription.additionalNotes}</div>
            </div>
          )}

          {/* Follow-up */}
          {(prescription.followUpDate || prescription.followUp) && (
            <div className="info-block-new followup-block">
              <div className="info-block-title-new">📅 Next Follow-up</div>
              <div className="info-block-content-new" style={{ fontWeight: '600' }}>
                {prescription.followUpDate 
                  ? new Date(prescription.followUpDate).toLocaleDateString('en-GB')
                  : (typeof prescription.followUp === 'string' && prescription.followUp.includes('-')
                      ? new Date(prescription.followUp).toLocaleDateString('en-GB')
                      : prescription.followUp)}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="footer-new">
            <div className="footer-note-new">
              * This is a digitally generated prescription<br />
              * Please bring this prescription for follow-up visits<br />
              * In case of emergency, contact: {prescription.emergencyContact || prescription.clinicPhone || 'Clinic Number'}
            </div>
            <div className="signature-block-new">
              <div className="signature-line-new"></div>
              <div className="signature-name-new">{prescription.doctorName || 'Dr. Name'}</div>
              <div className="signature-reg-new">{prescription.doctorDegree || 'MBBS, MD'}</div>
              <div className="signature-reg-new">Reg. No: {prescription.doctorRegistration || 'REG123456'}</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionModal;
