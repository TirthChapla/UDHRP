import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './ReceptionistDashboard.css';

function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    type: 'Consultation',
    reason: ''
  });

  // Mock data - replace with API calls
  const [todayAppointments] = useState([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      patientEmail: 'rajesh@example.com',
      time: '10:00 AM',
      type: 'Consultation',
      status: 'confirmed'
    },
    {
      id: 2,
      patientName: 'Priya Sharma',
      patientEmail: 'priya@example.com',
      time: '11:30 AM',
      type: 'Follow-up',
      status: 'confirmed'
    },
    {
      id: 3,
      patientName: 'Amit Patel',
      patientEmail: 'amit@example.com',
      time: '2:00 PM',
      type: 'Checkup',
      status: 'pending'
    }
  ]);

  const [stats] = useState({
    totalPatients: 45,
    todayAppointments: 8,
    pendingConfirmations: 3,
    completedToday: 2
  });

  const handleSearchPatient = () => {
    // Mock search - replace with actual API call
    if (searchEmail) {
      // Simulate found patient
      const mockPatient = {
        found: true,
        name: 'John Doe',
        email: searchEmail,
        hasAppointment: false,
        patientId: 'PAT-123'
      };
      setSearchResult(mockPatient);
    }
  };

  const handleRegisterNewPatient = () => {
    // Redirect to patient registration
    navigate('/register', { state: { isReceptionist: true } });
  };

  const handleAddToSchedule = () => {
    setShowAddAppointment(true);
  };

  const handleSubmitAppointment = (e) => {
    e.preventDefault();
    // Mock appointment creation - replace with API call
    console.log('Creating appointment:', {
      patient: searchResult,
      ...appointmentData
    });
    alert('Appointment added successfully!');
    setShowAddAppointment(false);
    setSearchResult(null);
    setSearchEmail('');
    setAppointmentData({
      date: '',
      time: '',
      type: 'Consultation',
      reason: ''
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { icon: CheckCircle, class: 'status-confirmed', text: 'Confirmed' },
      pending: { icon: Clock, class: 'status-pending', text: 'Pending' },
      cancelled: { icon: XCircle, class: 'status-cancelled', text: 'Cancelled' }
    };
    
    const StatusIcon = badges[status]?.icon || Clock;
    return (
      <span className={`status-badge ${badges[status]?.class}`}>
        <StatusIcon size={16} />
        {badges[status]?.text}
      </span>
    );
  };

  return (
    <div className="receptionist-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <Users size={32} className="header-icon" />
          <div>
            <h1 className="dashboard-title">Receptionist Dashboard</h1>
            <p className="dashboard-subtitle">Manage patients and appointments</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <Card variant="default" className="stat-card">
          <div className="stat-icon-wrapper stat-primary">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPatients}</div>
            <div className="stat-label">Total Patients</div>
          </div>
        </Card>

        <Card variant="default" className="stat-card">
          <div className="stat-icon-wrapper stat-success">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.todayAppointments}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
        </Card>

        <Card variant="default" className="stat-card">
          <div className="stat-icon-wrapper stat-warning">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingConfirmations}</div>
            <div className="stat-label">Pending Confirmations</div>
          </div>
        </Card>

        <Card variant="default" className="stat-card">
          <div className="stat-icon-wrapper stat-info">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedToday}</div>
            <div className="stat-label">Completed Today</div>
          </div>
        </Card>
      </div>

      {/* Patient Search Section */}
      <Card variant="default" className="search-section">
        <div className="section-header">
          <Search size={24} />
          <h2>Patient Search</h2>
        </div>

        <div className="search-form">
          <div className="search-input-group">
            <Input
              type="email"
              placeholder="Enter patient email address"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchPatient()}
            />
            <Button onClick={handleSearchPatient}>Search Patient</Button>
          </div>

          <Button 
            variant="outline" 
            onClick={handleRegisterNewPatient}
            className="register-btn"
          >
            <UserPlus size={20} />
            Register New Patient
          </Button>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className="search-result">
            {searchResult.found ? (
              <div className="patient-found">
                <div className="patient-info">
                  <CheckCircle size={24} className="success-icon" />
                  <div>
                    <h3>{searchResult.name}</h3>
                    <p className="patient-email">{searchResult.email}</p>
                    <p className="patient-id">ID: {searchResult.patientId}</p>
                  </div>
                </div>

                {searchResult.hasAppointment ? (
                  <div className="appointment-exists">
                    <AlertCircle size={20} />
                    <span>Patient has an existing appointment</span>
                  </div>
                ) : (
                  <Button onClick={handleAddToSchedule}>
                    <Calendar size={20} />
                    Add to Schedule
                  </Button>
                )}
              </div>
            ) : (
              <div className="patient-not-found">
                <XCircle size={24} className="error-icon" />
                <div>
                  <h3>Patient Not Found</h3>
                  <p>No UDHRP account found with this email</p>
                  <Button onClick={handleRegisterNewPatient} className="mt-2">
                    Help Patient Register
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <div className="modal-overlay" onClick={() => setShowAddAppointment(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Calendar size={24} />
                Add to Doctor's Schedule
              </h2>
              <button 
                className="modal-close" 
                onClick={() => setShowAddAppointment(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitAppointment}>
              <div className="modal-body">
                <div className="patient-info-display">
                  <h3>{searchResult?.name}</h3>
                  <p>{searchResult?.email}</p>
                </div>

                <div className="form-grid">
                  <Input
                    label="Appointment Date"
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData({
                      ...appointmentData,
                      date: e.target.value
                    })}
                    required
                  />

                  <Input
                    label="Appointment Time"
                    type="time"
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData({
                      ...appointmentData,
                      time: e.target.value
                    })}
                    required
                  />

                  <div className="form-group">
                    <label>Appointment Type</label>
                    <select
                      className="form-select"
                      value={appointmentData.type}
                      onChange={(e) => setAppointmentData({
                        ...appointmentData,
                        type: e.target.value
                      })}
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Checkup">Checkup</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <Input
                    label="Reason for Visit"
                    type="text"
                    placeholder="Brief description"
                    value={appointmentData.reason}
                    onChange={(e) => setAppointmentData({
                      ...appointmentData,
                      reason: e.target.value
                    })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddAppointment(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Appointment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Today's Appointments */}
      <Card variant="default" className="appointments-section">
        <div className="section-header">
          <Calendar size={24} />
          <h2>Today's Appointments</h2>
        </div>

        <div className="appointments-list">
          {todayAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-item">
              <div className="appointment-time">
                <Clock size={20} />
                <span>{appointment.time}</span>
              </div>

              <div className="appointment-details">
                <h3>{appointment.patientName}</h3>
                <p className="appointment-email">{appointment.patientEmail}</p>
                <span className="appointment-type">{appointment.type}</span>
              </div>

              <div className="appointment-status">
                {getStatusBadge(appointment.status)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ReceptionistDashboard;
