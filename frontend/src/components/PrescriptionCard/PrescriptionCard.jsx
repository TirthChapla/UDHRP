import React, { useState } from 'react';
import { Calendar, Clock, Pill, ClipboardList, FileText, Stethoscope, Award, FlaskRound, ChevronDown } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function PrescriptionCard({ prescription, onViewDetails, onViewLabReportsForPrescription }) {
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);

  const hasLabReports = (prescription.labReportIds && prescription.labReportIds.length > 0) ||
                        (Array.isArray(prescription.labReports) && prescription.labReports.length > 0);

  const handleCardClick = (e) => {
    // Don't trigger if clicking on lab report buttons
    if (e.target.closest('.reports-dropdown-button') || e.target.closest('.reports-dropdown-menu')) {
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
        
        {/* Lab Reports Dropdown Button */}
        {hasLabReports && (
          <div className="reports-dropdown-container">
            <button
              className="reports-dropdown-button"
              onClick={(e) => {
                e.stopPropagation();
                if (!showReportsDropdown) {
                  onViewLabReportsForPrescription(prescription);
                }
                setShowReportsDropdown(!showReportsDropdown);
              }}
              title="View lab reports linked to this prescription"
            >
              <FlaskRound size={16} />
              <span>Lab Reports</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  transform: showReportsDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>
            
            {showReportsDropdown && (
              <div className="reports-dropdown-menu">
                <div className="reports-menu-label">
                  <FlaskRound size={14} />
                  Related Reports
                </div>
              </div>
            )}
          </div>
        )}
        
        {!hasLabReports && (
          <div className="no-reports-badge">
            <FlaskRound size={14} />
            <span>No lab reports linked</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default PrescriptionCard;
