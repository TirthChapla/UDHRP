import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  FlaskRound,
  FileText,
  Printer, 
  ZoomIn, 
  ZoomOut
} from 'lucide-react';
import '../PrescriptionModal/PrescriptionModal.css';

function LabReportModal({ report, onClose, onDownload }) {
  const [zoom, setZoom] = useState(1);
  const [touchDistance, setTouchDistance] = useState(0);
  const documentRef = useRef(null);

  if (!report) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    onDownload(report);
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

  const getStatusMarker = (status) => {
    if (status === 'high') return 'H';
    if (status === 'low') return 'L';
    return '';
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

        {/* Lab Report Document */}
        <div className="prescription-scroll-container">
          <div 
            ref={documentRef}
            className="prescription-document"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            {/* Header */}
            <div className="prescription-header">
              <div className="header-left">
                <h1 className="doctor-title">Laboratory's</h1>
                <p className="medical-subtitle">Medical Test Report</p>
              </div>
              <div className="header-right">
                <div className="rx-symbol">
                  <FlaskRound size={60} />
                </div>
              </div>
            </div>

            {/* Lab/Doctor Information */}
            <div className="doctor-info-box">
              <div className="info-inline-row">
                <span className="info-label-inline">Laboratory Name:</span>
                <span className="info-value-inline">{report.labName || 'Medical Laboratory'}</span>
              </div>
              <div className="info-inline-row">
                <span className="info-label-inline">Reg. No:</span>
                <span className="info-value-inline">{report.regNo || 'LAB-5110050156'}</span>
              </div>
              <div className="info-inline-row">
                <span className="info-label-inline">Doctor Name:</span>
                <span className="info-value-inline">Dr. {report.doctorName}</span>
              </div>
              <div className="info-inline-row">
                <span className="info-label-inline">Specialization:</span>
                <span className="info-value-inline">{report.doctorSpecialization}</span>
              </div>
              <div className="info-inline-row">
                <span className="info-label-inline">Date:</span>
                <span className="info-value-inline">
                  {new Date(report.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="section-divider"></div>

            {/* Patient Information */}
            <div className="patient-info-section">
              <h2 className="section-title">PATIENT INFORMATION</h2>
              
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label-cell">Patient Name / Patient Id No / M.R No:</td>
                    <td className="value-cell">{report.patientName || 'John Doe'}</td>
                    <td className="label-cell">Date:</td>
                    <td className="value-cell">
                      {new Date(report.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">Date of Birth:</td>
                    <td className="value-cell">01/01/1990</td>
                    <td className="label-cell">Age:</td>
                    <td className="value-cell">{report.age || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Gender:</td>
                    <td className="value-cell">{report.gender || 'Male'}</td>
                    <td className="label-cell">Ref. By:</td>
                    <td className="value-cell">{report.referredBy || 'SELF'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Sample Type:</td>
                    <td className="value-cell" colSpan="3">{report.sampleType || 'Blood Sample'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="section-divider"></div>

            {/* Test Results */}
            <div className="patient-info-section">
              <h2 className="section-title">{report.testName}</h2>
              
              <table className="info-table">
                <thead>
                  <tr>
                    <td className="label-cell">Test Name</td>
                    <td className="label-cell">Results</td>
                    <td className="label-cell">Units</td>
                    <td className="label-cell">Bio. Ref. Interval</td>
                  </tr>
                </thead>
                <tbody>
                  {report.results && report.results.map((result, index) => (
                    <tr key={index}>
                      <td className="value-cell">
                        {result.parameter}
                        {getStatusMarker(result.status) && (
                          <span style={{ 
                            marginLeft: '8px', 
                            fontWeight: 'bold', 
                            color: result.status === 'high' ? '#dc2626' : result.status === 'low' ? '#ea580c' : '#000'
                          }}>
                            {getStatusMarker(result.status)}
                          </span>
                        )}
                      </td>
                      <td className="value-cell" style={{ fontWeight: '600' }}>{result.value}</td>
                      <td className="value-cell">{result.unit}</td>
                      <td className="value-cell">{result.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doctor's Notes */}
            {report.notes && (
              <>
                <div className="section-divider"></div>
                <div className="prescription-rx-section">
                  <div className="prescription-title">Clinical Notes:</div>
                  <div className="prescription-text">{report.notes}</div>
                </div>
              </>
            )}

            <div className="section-divider"></div>

            {/* Signatures */}
            <div className="signature-section">
              <div className="signature-box">
                <div className="signature-line">Lab Technician Signature</div>
              </div>
              <div className="signature-box">
                <div className="signature-line">Doctor's Signature</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabReportModal;
