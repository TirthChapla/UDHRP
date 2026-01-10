import React from 'react';
import { X, FlaskRound, Calendar } from 'lucide-react';
import './LabReportsPopup.css';

function LabReportsPopup({ isOpen, onClose, labReports, isLoading, onReportClick }) {
  if (!isOpen) return null;

  return (
    <div className="lab-reports-popup-overlay" onClick={onClose}>
      <div className="lab-reports-popup-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lab-reports-popup-header">
          <div className="lab-reports-popup-title">
            <FlaskRound size={24} />
            <h2>Related Lab Reports</h2>
          </div>
          <button className="lab-reports-popup-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="lab-reports-popup-content">
          {isLoading ? (
            <div className="lab-reports-popup-loading">
              <p>Loading lab reports...</p>
            </div>
          ) : labReports && labReports.length > 0 ? (
            <div className="lab-reports-popup-grid">
              {labReports.map((report) => (
                <div
                  key={report.id}
                  className="lab-report-popup-card"
                  onClick={() => onReportClick(report)}
                >
                  <div className="lab-report-popup-icon">
                    <FlaskRound size={20} />
                  </div>
                  <h4>{report.testName}</h4>
                  <div className="lab-report-popup-meta">
                    <span className="lab-report-popup-date">
                      <Calendar size={14} />
                      {new Date(report.date).toLocaleDateString('en-IN', { 
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={`lab-report-popup-status status-${report.status?.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </div>
                  {report.laboratoryName && (
                    <p className="lab-report-popup-lab">{report.laboratoryName}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="lab-reports-popup-empty">
              <FlaskRound size={48} />
              <p>No lab reports found for this prescription</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LabReportsPopup;
