import React from 'react';
import { Calendar, FileText, Bell } from 'lucide-react';
import Card from '../Card/Card';

function DashboardStats({ appointmentsCount, recordsCount, remindersCount }) {
  return (
    <>
      <Card className="stat-card">
        <div className="stat-icon">
          <Calendar />
        </div>
        <div className="stat-content">
          <div className="stat-label">Appointments</div>
          <div className="stat-value">{appointmentsCount}</div>
          <div className="stat-description">Upcoming this month</div>
        </div>
      </Card>

      <Card className="stat-card">
        <div className="stat-icon">
          <FileText />
        </div>
        <div className="stat-content">
          <div className="stat-label">Medical Records</div>
          <div className="stat-value">{recordsCount}</div>
          <div className="stat-description">Total documents</div>
        </div>
      </Card>

      <Card className="stat-card">
        <div className="stat-icon">
          <Bell />
        </div>
        <div className="stat-content">
          <div className="stat-label">Reminders</div>
          <div className="stat-value">{remindersCount}</div>
          <div className="stat-description">Pending actions</div>
        </div>
      </Card>
    </>
  );
}

export default DashboardStats;
