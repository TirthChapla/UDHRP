import React from 'react';
import { Calendar } from 'lucide-react';
import Button from '../Button/Button';
import HealthScoreCard from '../HealthScoreCard/HealthScoreCard';
import DashboardStats from '../DashboardStats/DashboardStats';
import HealthMetrics from '../HealthMetrics/HealthMetrics';
import UpcomingAppointments from '../UpcomingAppointments/UpcomingAppointments';
import AIInsights from '../AIInsights/AIInsights';
import Reminders from '../Reminders/Reminders';
import RecentRecords from '../RecentRecords/RecentRecords';
import QuickActions from '../QuickActions/QuickActions';

function DashboardOverview({ 
  healthScore,
  appointments,
  healthMetrics,
  aiInsights,
  reminders,
  recentRecords,
  onBookAppointment,
  onTabChange
}) {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, John!</h1>
          <p className="dashboard-subtitle">Here's your health overview</p>
        </div>
        <Button 
          icon={<Calendar size={20} />}
          onClick={onBookAppointment}
        >
          Book Appointment
        </Button>
      </div>

      <div className="dashboard-stats">
        <HealthScoreCard score={healthScore} />
        <DashboardStats 
          appointmentsCount={appointments.length}
          recordsCount={156}
          remindersCount={reminders.length}
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <HealthMetrics metrics={healthMetrics} />
          <UpcomingAppointments appointments={appointments} />
          <AIInsights insights={aiInsights} />
        </div>

        <div className="dashboard-sidebar">
          <Reminders reminders={reminders} />
          <RecentRecords records={recentRecords} />
          <QuickActions 
            onFindDoctor={() => onTabChange('search-doctors')}
            onViewRecords={() => onTabChange('records')}
            onUpdateProfile={() => onTabChange('profile')}
          />
        </div>
      </div>
    </>
  );
}

export default DashboardOverview;
