import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Activity, 
  Calendar,
  X as XIcon,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import {
  getTodayAppointments,
  getTomorrowAppointments,
  getYesterdayAppointments,
  getLastWeekAppointments,
  getAppointmentsByDate,
  rescheduleAppointment
} from '../../services/doctorService';
import './DoctorSchedule.css';

function DoctorSchedule() {
  const navigate = useNavigate();
  const [allAppointments, setAllAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: ''
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Get today's date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Fetch appointments based on filter
  const fetchAppointments = async (filter, customDateValue = null) => {
    setLoading(true);
    setError('');
    
    try {
      let appointments = [];
      
      switch (filter) {
        case 'today':
          appointments = await getTodayAppointments();
          break;
        case 'tomorrow':
          appointments = await getTomorrowAppointments();
          break;
        case 'yesterday':
          appointments = await getYesterdayAppointments();
          break;
        case 'lastWeek':
          appointments = await getLastWeekAppointments();
          break;
        case 'custom':
          if (customDateValue) {
            appointments = await getAppointmentsByDate(customDateValue);
          }
          break;
        default:
          appointments = await getTodayAppointments();
      }
      
      setAllAppointments(appointments || []);
      setFilteredAppointments(appointments || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
      setAllAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Load appointments on mount and filter change
  useEffect(() => {
    fetchAppointments(dateFilter, customDate);
  }, [dateFilter]);

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    if (filter !== 'custom') {
      setCustomDate('');
    }
  };

  const handleCustomDateChange = (date) => {
    setCustomDate(date);
    setDateFilter('custom');
    fetchAppointments('custom', date);
  };

  const getFilterTitle = () => {
    switch (dateFilter) {
      case 'lastWeek':
        return 'Last Week\'s Schedule';
      case 'yesterday':
        return 'Yesterday\'s Schedule';
      case 'today':
        return 'Today\'s Schedule';
      case 'tomorrow':
        return 'Tomorrow\'s Schedule';
      case 'custom':
        return customDate ? `Schedule for ${new Date(customDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}` : 'Select a Date';
      default:
        return 'Today\'s Schedule';
    }
  };

  const getFilterSubtitle = () => {
    if (dateFilter === 'custom' && customDate) {
      return `${filteredAppointments.length} appointment${filteredAppointments.length !== 1 ? 's' : ''}`;
    }
    
    const dateMap = {
      lastWeek: `${yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      yesterday: yesterday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      today: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      tomorrow: tomorrow.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
    
    return dateMap[dateFilter] || '';
  };

  const handlePatientClick = (appointment) => {
    // Navigate to prescription page with patient info
    navigate(`/doctor/prescription`, { 
      state: { 
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        appointmentId: appointment.id
      } 
    });
  };

  const handleRescheduleClick = (appointment, e) => {
    e.stopPropagation(); // Prevent patient click event
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: appointment.date || '',
      time: appointment.time || ''
    });
    setRescheduleModal(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    setRescheduleLoading(true);
    
    try {
      await rescheduleAppointment({
        appointmentId: selectedAppointment.id,
        date: rescheduleData.date,
        time: rescheduleData.time
      });
      
      // Refresh appointments
      await fetchAppointments(dateFilter, customDate);
      
      // Close modal
      setRescheduleModal(false);
      setSelectedAppointment(null);
      
      // Show success message
      alert(`Appointment rescheduled for ${rescheduleData.date} at ${rescheduleData.time}`);
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      alert('Failed to reschedule appointment. Please try again.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const closeRescheduleModal = () => {
    setRescheduleModal(false);
    setSelectedAppointment(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} className="status-icon-completed" />;
      case 'in-progress':
        return <Activity size={20} className="status-icon-progress" />;
      case 'upcoming':
        return <Clock size={20} className="status-icon-upcoming" />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'schedule-item-completed';
      case 'in-progress':
        return 'schedule-item-progress';
      case 'upcoming':
        return 'schedule-item-upcoming';
      default:
        return '';
    }
  };

  const getTypeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'emergency':
        return 'type-emergency';
      case 'follow-up':
        return 'type-followup';
      case 'consultation':
        return 'type-consultation';
      case 'checkup':
        return 'type-checkup';
      default:
        return '';
    }
  };

  return (
    <div className="doctor-schedule">
      <div className="schedule-header">
        <div className="schedule-header-content">
          <Clock size={32} className="schedule-header-icon" />
          <div>
            <h1 className="schedule-title">{getFilterTitle()}</h1>
            <p className="schedule-subtitle">{getFilterSubtitle()}</p>
          </div>
        </div>
      </div>

      {/* Date Filter Buttons */}
      <div className="date-filter-container">
        <div className="date-filter-buttons">
          <button
            className={`filter-btn ${dateFilter === 'lastWeek' ? 'filter-btn-active' : ''}`}
            onClick={() => handleDateFilterChange('lastWeek')}
          >
            Last Week
          </button>
          <button
            className={`filter-btn ${dateFilter === 'yesterday' ? 'filter-btn-active' : ''}`}
            onClick={() => handleDateFilterChange('yesterday')}
          >
            Yesterday
          </button>
          <button
            className={`filter-btn ${dateFilter === 'today' ? 'filter-btn-active' : ''}`}
            onClick={() => handleDateFilterChange('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${dateFilter === 'tomorrow' ? 'filter-btn-active' : ''}`}
            onClick={() => handleDateFilterChange('tomorrow')}
          >
            Tomorrow
          </button>
        </div>

        <div className="custom-date-picker">
          <Calendar size={20} className="date-picker-icon" />
          <input
            type="date"
            className="date-input"
            value={customDate}
            onChange={(e) => handleCustomDateChange(e.target.value)}
            placeholder="Select custom date"
          />
        </div>
      </div>

      <div className="schedule-container">
        <Card variant="default" className="schedule-card">
          {loading ? (
            <div className="loading-container">
              <Loader size={48} className="loading-spinner" />
              <p>Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <AlertCircle size={48} className="error-icon" />
              <h3>Error</h3>
              <p>{error}</p>
              <Button onClick={() => fetchAppointments(dateFilter, customDate)}>
                Try Again
              </Button>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="schedule-list">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`schedule-item ${getStatusClass(appointment.status)}`}
                  onClick={() => handlePatientClick(appointment)}
                >
                  <div className="schedule-time">
                    <span className="time-text">{appointment.time}</span>
                  </div>

                  <div className="schedule-details">
                    <div className="schedule-patient-info">
                      <h3 className="patient-name">{appointment.patientName}</h3>
                      <span className={`appointment-type ${getTypeClass(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </div>
                    <div className="schedule-actions">
                      {getStatusIcon(appointment.status)}
                      {appointment.status !== 'completed' && (
                        <Button
                          variant="outline"
                          size="small"
                          onClick={(e) => handleRescheduleClick(appointment, e)}
                        >
                          Reschedule
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <Calendar size={48} className="no-appointments-icon" />
              <h3>No Appointments</h3>
              <p>There are no appointments scheduled for this date.</p>
            </div>
          )}
        </Card>

        <div className="schedule-summary">
          <Card variant="default" className="summary-card">
            <h3 className="summary-title">Summary</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <CheckCircle2 size={24} className="summary-icon-completed" />
                <div>
                  <div className="summary-value">
                    {filteredAppointments.filter(a => a.status === 'completed').length}
                  </div>
                  <div className="summary-label">Completed</div>
                </div>
              </div>
              <div className="summary-stat">
                <Activity size={24} className="summary-icon-progress" />
                <div>
                  <div className="summary-value">
                    {filteredAppointments.filter(a => a.status === 'in-progress').length}
                  </div>
                  <div className="summary-label">In Progress</div>
                </div>
              </div>
              <div className="summary-stat">
                <Clock size={24} className="summary-icon-upcoming" />
                <div>
                  <div className="summary-value">
                    {filteredAppointments.filter(a => a.status === 'upcoming').length}
                  </div>
                  <div className="summary-label">Upcoming</div>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default" className="info-card">
            <AlertCircle size={20} className="info-icon" />
            <div className="info-content">
              <h4>Quick Actions</h4>
              <p>Click on any patient to view/create their prescription</p>
              <p>Use "Reschedule" to change appointment time</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="modal-overlay" onClick={closeRescheduleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Calendar size={24} />
                Reschedule Appointment
              </h2>
              <button className="modal-close" onClick={closeRescheduleModal}>
                <XIcon size={24} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="modal-body">
                <div className="patient-info-card">
                  <h3>Patient: {selectedAppointment?.patientName}</h3>
                  <p>Current Time: {selectedAppointment?.time}</p>
                  <p>Type: {selectedAppointment?.type}</p>
                </div>

                <div className="form-grid">
                  <Input
                    label="New Date"
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    required
                  />

                  <Input
                    label="New Time"
                    type="time"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeRescheduleModal}
                  disabled={rescheduleLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={rescheduleLoading}>
                  {rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorSchedule;
