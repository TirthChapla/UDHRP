import React, { useState } from 'react';
import { 
  Stethoscope,
  Calendar, 
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  TrendingUp,
  Activity,
  Phone,
  Mail
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data
  const todayStats = {
    totalPatients: 12,
    completed: 8,
    upcoming: 4,
    cancelled: 0
  };

  const appointmentRequests = [
    {
      id: 1,
      patientName: 'Rahul Sharma',
      patientId: 'UH123456789',
      age: 34,
      gender: 'Male',
      date: '2025-12-28',
      time: '10:00 AM',
      reason: 'Regular Checkup',
      status: 'pending'
    },
    {
      id: 2,
      patientName: 'Priya Gupta',
      patientId: 'UH987654321',
      age: 28,
      gender: 'Female',
      date: '2025-12-28',
      time: '11:30 AM',
      reason: 'Follow-up Consultation',
      status: 'pending'
    },
    {
      id: 3,
      patientName: 'Amit Kumar',
      patientId: 'UH456789123',
      age: 45,
      gender: 'Male',
      date: '2025-12-29',
      time: '2:00 PM',
      reason: 'Chest Pain',
      status: 'pending'
    }
  ];

  const todaySchedule = [
    {
      id: 1,
      time: '9:00 AM',
      patient: 'Sanjay Patel',
      type: 'Follow-up',
      status: 'completed'
    },
    {
      id: 2,
      time: '10:00 AM',
      patient: 'Meera Singh',
      type: 'Consultation',
      status: 'completed'
    },
    {
      id: 3,
      time: '11:00 AM',
      patient: 'Vikram Reddy',
      type: 'Emergency',
      status: 'in-progress'
    },
    {
      id: 4,
      time: '2:00 PM',
      patient: 'Anjali Desai',
      type: 'Checkup',
      status: 'upcoming'
    },
    {
      id: 5,
      time: '3:30 PM',
      patient: 'Rohan Verma',
      type: 'Follow-up',
      status: 'upcoming'
    }
  ];

  const recentPrescriptions = [
    {
      id: 1,
      patientName: 'Sanjay Patel',
      date: '2025-12-23',
      diagnosis: 'Hypertension',
      medicines: 3
    },
    {
      id: 2,
      patientName: 'Meera Singh',
      date: '2025-12-23',
      diagnosis: 'Viral Fever',
      medicines: 4
    },
    {
      id: 3,
      patientName: 'Deepak Joshi',
      date: '2025-12-22',
      diagnosis: 'Diabetes Management',
      medicines: 2
    }
  ];

  const performanceMetrics = [
    { label: 'Patient Rating', value: '4.8', max: '5.0', icon: <Star size={20} /> },
    { label: 'Consultation Time', value: '18', unit: 'min', icon: <Clock size={20} /> },
    { label: 'Success Rate', value: '98', unit: '%', icon: <CheckCircle2 size={20} /> },
    { label: 'Total Patients', value: '1,247', icon: <Users size={20} /> }
  ];

  const handleApproveAppointment = (appointmentId) => {
    console.log('Approved appointment:', appointmentId);
    // API call would go here
  };

  const handleRescheduleAppointment = (appointmentId) => {
    console.log('Reschedule appointment:', appointmentId);
    // Show reschedule modal
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Good Morning, Dr. Sarah Patel!</h1>
          <p className="dashboard-subtitle">You have {appointmentRequests.length} pending appointment requests</p>
        </div>
        <div className="header-actions">
          <Button variant="outline" icon={<Calendar size={20} />}>
            View Schedule
          </Button>
          <Button icon={<FileText size={20} />}>
            New Prescription
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="dashboard-stats">
        <Card className="stat-card stat-card-primary">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-content">
            <div className="stat-label">Today's Patients</div>
            <div className="stat-value">{todayStats.totalPatients}</div>
            <div className="stat-description">{todayStats.completed} completed</div>
          </div>
        </Card>

        <Card className="stat-card stat-card-success">
          <div className="stat-icon stat-icon-success">
            <CheckCircle2 />
          </div>
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{todayStats.completed}</div>
            <div className="stat-description">Successfully treated</div>
          </div>
        </Card>

        <Card className="stat-card stat-card-warning">
          <div className="stat-icon stat-icon-warning">
            <Clock />
          </div>
          <div className="stat-content">
            <div className="stat-label">Upcoming</div>
            <div className="stat-value">{todayStats.upcoming}</div>
            <div className="stat-description">Scheduled today</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <FileText />
          </div>
          <div className="stat-content">
            <div className="stat-label">Prescriptions</div>
            <div className="stat-value">{recentPrescriptions.length}</div>
            <div className="stat-description">This week</div>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Appointment Requests */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Calendar size={24} />
                Appointment Requests
              </h3>
              <span className="badge badge-primary">{appointmentRequests.length} Pending</span>
            </div>
            <div className="appointment-requests">
              {appointmentRequests.map(appointment => (
                <div key={appointment.id} className="appointment-request-item">
                  <div className="appointment-request-header">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        {appointment.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="patient-name">{appointment.patientName}</div>
                        <div className="patient-id">ID: {appointment.patientId}</div>
                      </div>
                    </div>
                    <div className="appointment-time-badge">
                      <Clock size={14} />
                      {appointment.time}
                    </div>
                  </div>
                  <div className="appointment-request-details">
                    <div className="detail-item">
                      <span className="detail-label">Age/Gender:</span>
                      <span className="detail-value">{appointment.age} / {appointment.gender}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reason:</span>
                      <span className="detail-value">{appointment.reason}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="appointment-request-actions">
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => handleRescheduleAppointment(appointment.id)}
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="small"
                      onClick={() => handleApproveAppointment(appointment.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Activity size={24} />
                Performance Metrics
              </h3>
            </div>
            <div className="performance-metrics-grid">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="performance-metric">
                  <div className="performance-metric-icon">{metric.icon}</div>
                  <div className="performance-metric-content">
                    <div className="performance-metric-label">{metric.label}</div>
                    <div className="performance-metric-value">
                      {metric.value}
                      {metric.unit && <span className="metric-unit">{metric.unit}</span>}
                      {metric.max && <span className="metric-max">/ {metric.max}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="dashboard-sidebar">
          {/* Today's Schedule */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Clock size={24} />
                Today's Schedule
              </h3>
            </div>
            <div className="schedule-list">
              {todaySchedule.map(item => (
                <div key={item.id} className={`schedule-item schedule-${item.status}`}>
                  <div className="schedule-time">{item.time}</div>
                  <div className="schedule-details">
                    <div className="schedule-patient">{item.patient}</div>
                    <div className="schedule-type">{item.type}</div>
                  </div>
                  <div className={`schedule-status status-${item.status}`}>
                    {item.status === 'completed' && <CheckCircle2 size={16} />}
                    {item.status === 'in-progress' && <Activity size={16} />}
                    {item.status === 'upcoming' && <Clock size={16} />}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Prescriptions */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <FileText size={24} />
                Recent Prescriptions
              </h3>
            </div>
            <div className="prescriptions-list">
              {recentPrescriptions.map(prescription => (
                <div key={prescription.id} className="prescription-item">
                  <div className="prescription-icon">
                    <FileText size={20} />
                  </div>
                  <div className="prescription-content">
                    <div className="prescription-patient">{prescription.patientName}</div>
                    <div className="prescription-diagnosis">{prescription.diagnosis}</div>
                    <div className="prescription-meta">
                      {new Date(prescription.date).toLocaleDateString()} • {prescription.medicines} medicines
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-card quick-actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <Button variant="outline" fullWidth icon={<Users size={18} />}>
                Search Patient
              </Button>
              <Button variant="outline" fullWidth icon={<FileText size={18} />}>
                Create Prescription
              </Button>
              <Button variant="outline" fullWidth icon={<Calendar size={18} />}>
                Manage Availability
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
