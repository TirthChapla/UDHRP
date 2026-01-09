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

  // Ensure results is always an array
  const resultsArray = Array.isArray(report.results) ? report.results : [];
  
  // Add debug logging
  console.log('[LabReportModal] Report data:', report);
  console.log('[LabReportModal] Results array:', resultsArray);

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

  try {
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
            className="lab-report-document"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            {/* Header */}
            <div className="lab-header">
              <div className="lab-header-left">
                <div className="lab-brand">{report.labName || 'Flabs Diagnostics'}</div>
                <div className="lab-tagline">Comprehensive Pathology & Diagnostics</div>
                <div className="lab-meta">
                  {report.labAddress || '123 Medical Street, City, State, ZIP'}<br />
                  Phone: {report.labPhone || '+91 1234567890'} | Reg. No.: {report.regNo || 'LAB-5110050156'}
                </div>
              </div>
              <div className="lab-header-right">
                <div className="lab-report-title">Patient Report</div>
                <div className="lab-report-date">
                  {new Date(report.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div className="lab-badge">
                  <FlaskRound size={40} />
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="lab-info-grid">
              <div className="lab-card">
                <div className="lab-card-title">Patient Details</div>
                <div className="lab-info-row"><span>Patient Name</span><span>{report.patientName || 'John Doe'}</span></div>
                <div className="lab-info-row"><span>Patient ID</span><span>{report.patientId || 'N/A'}</span></div>
                <div className="lab-info-row"><span>Age / Gender</span><span>{report.age || 'N/A'} / {report.gender || 'Male'}</span></div>
                <div className="lab-info-row"><span>Ref. By</span><span>{report.referredBy || 'SELF'}</span></div>
              </div>

              <div className="lab-card">
                <div className="lab-card-title">Test Details</div>
                <div className="lab-info-row"><span>Test Name</span><span>{report.testName || 'Laboratory Test'}</span></div>
                <div className="lab-info-row"><span>Sample Type</span><span>{report.sampleType || 'Blood Sample'}</span></div>
                <div className="lab-info-row"><span>Sample Collected</span><span>{report.sampleCollectedAt || report.date ? new Date(report.date).toLocaleDateString('en-GB') : 'N/A'}</span></div>
                <div className="lab-info-row"><span>Reported On</span><span>{report.reportedAt ? new Date(report.reportedAt).toLocaleDateString('en-GB') : new Date(report.date).toLocaleDateString('en-GB')}</span></div>
              </div>

              <div className="lab-card">
                <div className="lab-card-title">Laboratory</div>
                <div className="lab-info-row"><span>Lab Name</span><span>{report.labName || 'Flabs Diagnostics'}</span></div>
                <div className="lab-info-row"><span>Reg. No</span><span>{report.regNo || 'LAB-5110050156'}</span></div>
                <div className="lab-info-row"><span>Doctor</span><span>Dr. {report.doctorName || 'Pathologist'}</span></div>
                <div className="lab-info-row"><span>Specialization</span><span>{report.doctorSpecialization || 'MD Pathology'}</span></div>
              </div>
            </div>

            {/* Results Table */}
            <div className="lab-section">
              <div className="lab-section-title">Results</div>
              <table className="lab-results-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Result</th>
                    <th>Units</th>
                    <th>Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsArray && resultsArray.length > 0 ? (
                    resultsArray.map((result, index) => (
                      <tr key={index}>
                        <td>
                          {result.parameter || result.testName || 'Test'}
                          {result.status && (
                            <span className={`lab-status lab-status-${result.status}`}>
                              {getStatusMarker(result.status)}
                            </span>
                          )}
                        </td>
                        <td className="lab-strong">{result.value || 'N/A'}</td>
                        <td>{result.unit || ''}</td>
                        <td>{result.range || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '12px' }}>No results available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Interpretation */}
            {report.notes && (
              <div className="lab-section">
                <div className="lab-section-title">Interpretation / Clinical Notes</div>
                <div className="lab-note-box">{report.notes}</div>
              </div>
            )}

            {/* Footer */}
            <div className="lab-footer">
              <div className="lab-footer-left">
                <div className="lab-footer-title">Remarks & Disclaimers</div>
                <ul>
                  <li>This is a computer generated report.</li>
                  <li>Results are for clinician use; correlate clinically.</li>
                  <li>In case of emergency, contact the laboratory immediately.</li>
                </ul>
              </div>
              <div className="lab-signature-block">
                <div className="lab-sign-line"></div>
                <div className="lab-sign-name">Dr. {report.doctorName || 'Pathologist'}</div>
                <div className="lab-sign-role">{report.doctorSpecialization || 'MD Pathology'}</div>
                <div className="lab-sign-role">Reg. No: {report.regNo || 'LAB-5110050156'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error('[LabReportModal] Rendering error:', error);
    return (
      <div className="prescription-modal-overlay" onClick={handleOverlayClick}>
        <div className="prescription-paper" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Error Loading Lab Report</h2>
          <p>{error.message}</p>
          <button className="action-btn close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
}

export default LabReportModal;
