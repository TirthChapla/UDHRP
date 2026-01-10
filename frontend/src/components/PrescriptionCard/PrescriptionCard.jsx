import React from 'react';
import {
  Calendar,
  Clock,
  Pill,
  ClipboardList,
  FileText,
  Stethoscope,
  Award,
  FlaskRound
} from 'lucide-react';

import Card from '../Card/Card';
import Button from '../Button/Button';

function PrescriptionCard({
  prescription,
  onViewDetails,
  onViewLabReportsForPrescription
}) {
  const hasLabReports =
    Array.isArray(prescription.labReportIds) &&
    prescription.labReportIds.length > 0;

  const handleCardClick = (e) => {
    if (e.target.closest('.reports-dropdown-button')) return;
    onViewDetails(prescription);
  };

  // const handleLabReportsClick = (e) => {
  //   e.stopPropagation();
  //   onViewLabReportsForPrescription(prescription);
  // };
  const handleLabReportsClick = (e) => {
    e.stopPropagation();

    // ✅ SAFETY GUARD (prevents crash)
    if (typeof onViewLabReportsForPrescription !== 'function') {
      console.warn(
        '[PrescriptionCard] onViewLabReportsForPrescription is not provided'
      );
      return;
    }

    onViewLabReportsForPrescription(prescription);
  };
  return (
    <Card
      className="prescription-card-clean"
      hover
      onClick={handleCardClick}
    >
      {/* Doctor Info */}
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

        <p className="prescription-preview">
          {prescription.preview}
        </p>

        <div className="medications-summary">
          <Pill size={16} />
          {prescription.medications.length} medication
          {prescription.medications.length !== 1 ? 's' : ''} prescribed
        </div>

        <div className="prescription-meta">
          <Clock size={14} /> {prescription.time}
        </div>
      </div>

      {/* Actions */}
      <div className="prescription-card-action">
        <Button
          variant="primary"
          fullWidth
          icon={<FileText size={16} />}
        >
          View Full Prescription
        </Button>

        {hasLabReports ? (
          <button
            className="reports-dropdown-button"
            onClick={handleLabReportsClick}
            title="View related lab reports"
          >
            <FlaskRound size={16} />
            <span>
              Lab Reports ({prescription.labReportIds.length})
            </span>
          </button>
        ) : (
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
