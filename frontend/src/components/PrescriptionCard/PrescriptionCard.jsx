import React from 'react';
import { Calendar, Clock, Pill, ClipboardList, FileText, Stethoscope, Award, FlaskRound } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function PrescriptionCard({ prescription, onViewDetails, onViewLabReport, labReports = [] }) {
  // Get related lab reports for this prescription
  const relatedReports = prescription.relatedLabReportIds 
    ? labReports.filter(report => prescription.relatedLabReportIds.includes(report.id))
    : [];

  console.log('Prescription:', prescription.id, 'Related Report IDs:', prescription.relatedLabReportIds);
  console.log('Lab Reports Available:', labReports.length);
  console.log('Related Reports Found:', relatedReports.length, relatedReports);

  const handleCardClick = (e) => {
    // Don't trigger if clicking on lab report buttons
    if (e.target.closest('.lab-report-button')) {
      return;
    }
    onViewDetails(prescription);
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
        
        {/* Lab Reports Section */}
        {relatedReports.length && (
          <div className="lab-reports-section">
            <div className="lab-reports-header">
              <FlaskRound size={14} />
              <span>Related Lab Reports:</span>
            </div>
            <div className="lab-reports-buttons">
              {relatedReports.map(report => (
                <button
                  key={report.id}
                  className="lab-report-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewLabReport(report);
                  }}
                >
                  <FlaskRound size={14} />
                  {report.testName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default PrescriptionCard;
