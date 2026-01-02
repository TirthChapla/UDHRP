import React from 'react';
import { Calendar, Clock, FlaskRound, Building2, Stethoscope, Award, FileText } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function LabReportCard({ report, onViewDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const handleCardClick = (e) => {
    onViewDetails(report);
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
          <h3 className="doctor-name">{report.doctorName}</h3>
          <div className="doctor-specialization">
            <Award size={16} />
            {report.doctorSpecialization}
          </div>
        </div>
        <div className="prescription-date-badge-top">
          <Calendar size={16} />
          {new Date(report.date).toLocaleDateString('en-IN', { 
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Lab Report Details */}
      <div className="prescription-details-section">
        <div className="diagnosis-tag" style={{ background: '#dbeafe', color: '#1e40af' }}>
          <FlaskRound size={16} />
          {report.testName}
        </div>
        
        <div className="prescription-preview">
          <p>{report.preview}</p>
        </div>

        <div className="lab-name-section">
          <Building2 size={16} />
          <span>{report.labName}</span>
        </div>

        <div className="prescription-meta">
          <span>
            <Clock size={14} />
            {report.time}
          </span>
          <span 
            className="follow-up-indicator" 
            style={{ color: getStatusColor(report.status) }}
          >
            Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="prescription-card-action">
        <Button variant="primary" size="medium" fullWidth icon={<FileText size={16} />}>
          View Full Report
        </Button>
      </div>
    </Card>
  );
}

export default LabReportCard;
