import React, { useState } from 'react';
import { Calendar, Clock, Pill, ClipboardList, FileText, Stethoscope, Award, FlaskRound, X } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { getLabReportsForPrescription } from '../../services/patientService';

function PrescriptionCard({ prescription, onViewDetails, onViewLabReport }) {
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [labReports, setLabReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const hasLabReports = (prescription.labReportIds && prescription.labReportIds.length > 0) ||
                        (Array.isArray(prescription.labReports) && prescription.labReports.length > 0);

  const handleCardClick = (e) => {
    // Don't trigger if clicking on lab report buttons
    if (e.target.closest('.reports-modal-button') || e.target.closest('.lab-reports-modal')) {
      return;
    }
    onViewDetails(prescription);
  };

  const handleOpenLabReports = async (e) => {
    e.stopPropagation();
    setShowReportsModal(true);
    
    // Fetch reports if not already loaded
    if (labReports.length === 0 && !loadingReports) {
      setLoadingReports(true);
      try {
        const reports = await getLabReportsForPrescription(prescription.id);
        setLabReports(reports);
      } catch (error) {
        console.error('Failed to load lab reports:', error);
      } finally {
        setLoadingReports(false);
      }
    }
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setShowReportsModal(false);
  };

  const handleLabReportClick = (report, e) => {
    e.stopPropagation();
    setShowReportsModal(false);
    if (onViewLabReport) {
      onViewLabReport(report);
    }
  };

  return (
    <Card 
      className="prescription-card-clean"
      hover
      onClick={handleCardClick}
    >
      {/* Doctor Information with Date */}
      <div className="prescription-doctor-info">
        <div className="doctor-avatar">
          <Stethoscope size={32} />
        </div>
        <div className="doctor-basic-info">
          <h3 className="doctor-name">{prescription.doctorName}</h3>
          <div className="doctor-specialization">
            <Award size={16} />
            {prescription.doctorSpecialization}
          </div>
        </div>
        <div className="prescription-date-badge-top">
          <Calendar size={16} />
          {new Date(prescription.date).toLocaleDateString('en-IN', { 
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Prescription Details */}
      <div className="prescription-details-section">
        <div className="diagnosis-tag">
          <ClipboardList size={16} />
          {prescription.diagnosis}
        </div>
        
        <div className="prescription-preview">
          <p>{prescription.preview}</p>
        </div>

        <div className="medications-summary">
          <Pill size={16} />
          <span>{prescription.medications.length} medication{prescription.medications.length !== 1 ? 's' : ''} prescribed</span>
        </div>

        <div className="prescription-meta">
          <span>
            <Clock size={14} />
            {prescription.time}
          </span>
          {prescription.followUp && (
            <span className="follow-up-indicator">
              Follow-up: {typeof prescription.followUp === 'string' && prescription.followUp.includes('-') 
                ? new Date(prescription.followUp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                : prescription.followUp}
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="prescription-card-action">
        <Button variant="primary" size="medium" fullWidth icon={<FileText size={16} />}>
          View Full Prescription
        </Button>
        
        {/* Lab Reports Button */}
        {hasLabReports && (
          <button
            className="reports-modal-button"
            onClick={handleOpenLabReports}
            title="View lab reports linked to this prescription"
          >
            <FlaskRound size={16} />
            <span>Lab Reports ({prescription.labReportIds?.length || 0})</span>
          </button>
        )}
        
        {!hasLabReports && (
          <div className="no-reports-badge">
            <FlaskRound size={14} />
            <span>No lab reports linked</span>
          </div>
        )}
      </div>

      {/* Lab Reports Modal */}
      {showReportsModal && (
        <div className="lab-reports-overlay" onClick={handleCloseModal}>
          <div className="lab-reports-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FlaskRound size={20} /> Related Lab Reports</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {loadingReports ? (
                <div className="loading-state">
                  <p>Loading lab reports...</p>
                </div>
              ) : labReports && labReports.length > 0 ? (
                <div className="lab-reports-grid">
                  {labReports.map((report) => (
                    <div
                      key={report.id}
                      className="lab-report-item-card"
                      onClick={(e) => handleLabReportClick(report, e)}
                    >
                      <div className="lab-report-header">
                        <FlaskRound size={20} />
                        <h4>{report.testName}</h4>
                      </div>
                      <div className="lab-report-details">
                        <p className="lab-report-date">
                          <Calendar size={14} />
                          {new Date(report.date).toLocaleDateString('en-IN', { 
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <span className={`report-status-badge status-${report.status?.toLowerCase()}`}>
                          {report.status}
                        </span>
                      </div>
                      {report.laboratoryName && (
                        <p className="lab-name">Lab: {report.laboratoryName}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FlaskRound size={48} />
                  <p>No lab reports found for this prescription</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default PrescriptionCard;
