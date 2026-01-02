import React from 'react';
import { Calendar, Clock, MapPin, Stethoscope } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function AppointmentsSection({ appointments, onBookNew }) {
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
                  <span>{appointment.location}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="appointment-right-section">
                <div className={`status-badge-compact badge-${appointment.status}`}>
                  {appointment.status}
                </div>
                <div className="appointment-actions-compact">
                  <Button variant="outline" size="small">Reschedule</Button>
                  <Button variant="danger" size="small">Cancel</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AppointmentsSection;
