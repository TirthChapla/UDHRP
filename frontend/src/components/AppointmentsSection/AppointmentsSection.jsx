import React from 'react';
import { Calendar, Clock, MapPin, Stethoscope, Loader2 } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function AppointmentsSection({ appointments, onBookNew, onCancel, loading }) {
  if (loading) {
    return (
      <div className="appointments-section">
        <div className="section-header">
          <h1 className="section-title">My Appointments</h1>
          <Button 
            icon={<Calendar size={20} />}
            onClick={onBookNew}
          >
            Book New Appointment
          </Button>
        </div>
        <Card className="loading-card">
          <div className="loading-content">
            <Loader2 className="loading-spinner" size={48} />
            <p>Loading appointments...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="appointments-section">
      <div className="section-header">
        <h1 className="section-title">My Appointments</h1>
        <Button 
          icon={<Calendar size={20} />}
          onClick={onBookNew}
        >
          Book New Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="empty-state">
          <Calendar size={64} />
          <h3>No upcoming appointments</h3>
          <p>Book a new appointment to get started</p>
          <Button onClick={onBookNew}>Find a Doctor</Button>
        </Card>
      ) : (
        <div className="appointments-list-detailed">
          {appointments.map(appointment => (
            <Card key={appointment.id} className="appointment-card-compact">
              <div className="appointment-compact-layout">
                {/* Doctor Info */}
                <div className="doctor-info-compact">
                  <div className="doctor-avatar-compact">
                    <Stethoscope size={20} />
                  </div>
                  <div className="doctor-details">
                    <h3>{appointment.doctorName}</h3>
                    <p>{appointment.specialization}</p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="appointment-info-compact">
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>{new Date(appointment.date).toLocaleDateString('en-IN', { 
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{appointment.location || appointment.type || 'Consultation'}</span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="appointment-right-section">
                  <div className={`status-badge-compact badge-${appointment.status}`}>
                    {appointment.status}
                  </div>
                  {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                    <div className="appointment-actions-compact">
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => onCancel && onCancel(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsSection;
