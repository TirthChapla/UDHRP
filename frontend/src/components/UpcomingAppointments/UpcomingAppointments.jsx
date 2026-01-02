import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function UpcomingAppointments({ appointments }) {
  return (
    <Card className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">
          <Calendar size={24} />
          Upcoming Appointments
        </h3>
        <Button variant="ghost" size="small">View All</Button>
      </div>
      <div className="appointments-list">
        {appointments.map(appointment => (
          <div key={appointment.id} className="appointment-item">
            <div className="appointment-date">
              <div className="appointment-day">
                {new Date(appointment.date).getDate()}
              </div>
              <div className="appointment-month">
                {new Date(appointment.date).toLocaleString('default', { month: 'short' })}
              </div>
            </div>
            <div className="appointment-details">
              <div className="appointment-doctor">{appointment.doctorName}</div>
              <div className="appointment-specialization">{appointment.specialization}</div>
              <div className="appointment-meta">
                <span>
                  <Clock size={14} />
                  {appointment.time}
                </span>
                <span>
                  <MapPin size={14} />
                  {appointment.location}
                </span>
              </div>
            </div>
            <div className={`appointment-status status-${appointment.status}`}>
              {appointment.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default UpcomingAppointments;
