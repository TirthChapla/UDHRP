import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Activity, 
  Calendar,
  X as XIcon,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './DoctorSchedule.css';

function DoctorSchedule() {
  const [allAppointments] = useState([
    // Yesterday appointments
    {
      id: 1,
      time: '9:00 AM',
      patientName: 'Rajesh Kumar',
      patientId: 'PAT-101',
      type: 'Consultation',
      status: 'completed',
      date: '2026-01-02'
    },
    {
      id: 2,
      time: '11:00 AM',
      patientName: 'Priya Sharma',
      patientId: 'PAT-102',
      type: 'Follow-up',
      status: 'completed',
      date: '2026-01-02'
    },
    {
      id: 3,
      time: '2:00 PM',
      patientName: 'Amit Patel',
      patientId: 'PAT-103',
      type: 'Checkup',
      status: 'completed',
      date: '2026-01-02'
    },
    // Today's appointments
    {
      id: 4,
      time: '9:00 AM',
      patientName: 'Sanjay Patel',
      patientId: 'PAT-001',
      type: 'Follow-up',
      status: 'completed',
      date: '2026-01-03'
    },
    {
      id: 5,
      time: '10:00 AM',
      patientName: 'Meera Singh',
      patientId: 'PAT-002',
      type: 'Consultation',
      status: 'completed',
      date: '2026-01-03'
    },
    {
      id: 6,
      time: '11:00 AM',
      patientName: 'Vikram Reddy',
      patientId: 'PAT-003',
      type: 'Emergency',
      status: 'in-progress',
      date: '2026-01-03'
    },
    {
      id: 7,
      time: '2:00 PM',
      patientName: 'Anjali Desai',
      patientId: 'PAT-004',
      type: 'Checkup',
      status: 'upcoming',
      date: '2026-01-03'
    },
    {
      id: 8,
      time: '3:30 PM',
      patientName: 'Rohan Verma',
      patientId: 'PAT-005',
      type: 'Follow-up',
      status: 'upcoming',
      date: '2026-01-03'
    },
    // Tomorrow's appointments
    {
      id: 9,
      time: '9:30 AM',
      patientName: 'Kavita Reddy',
      patientId: 'PAT-201',
      type: 'Consultation',
      status: 'upcoming',
      date: '2026-01-04'
    },
    {
      id: 10,
      time: '11:00 AM',
      patientName: 'Deepak Gupta',
      patientId: 'PAT-202',
      type: 'Follow-up',
      status: 'upcoming',
      date: '2026-01-04'
    },
    {
      id: 11,
      time: '1:00 PM',
      patientName: 'Neha Kapoor',
      patientId: 'PAT-203',
      type: 'Checkup',
      status: 'upcoming',
      date: '2026-01-04'
    },
    // Last week appointments (Dec 27-31)
    {
      id: 12,
      time: '10:00 AM',
      patientName: 'Ravi Singh',
      patientId: 'PAT-301',
      type: 'Consultation',
      status: 'completed',
      date: '2025-12-27'
    },
    {
      id: 13,
      time: '2:00 PM',
      patientName: 'Sunita Sharma',
      patientId: 'PAT-302',
      type: 'Follow-up',
      status: 'completed',
      date: '2025-12-28'
    },
    {
      id: 14,
      time: '11:00 AM',
      patientName: 'Anil Kumar',
      patientId: 'PAT-303',
      type: 'Checkup',
      status: 'completed',
      date: '2025-12-30'
    },
    {
      id: 15,
      time: '3:00 PM',
      patientName: 'Pooja Desai',
      patientId: 'PAT-304',
      type: 'Consultation',
      status: 'completed',
      date: '2025-12-31'
    }
  ]);

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: ''
  });

  // Get today's date
  const today = new Date('2026-01-03');
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Convert 12-hour time to 24-hour for sorting
  const convertTo24Hour = (time) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  // Filter appointments based on selected filter
  useEffect(() => {
    let filtered = [];

    switch (dateFilter) {
      case 'lastWeek':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = allAppointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= weekAgo && aptDate < today;
        });
        break;

      case 'yesterday':
        filtered = allAppointments.filter(apt => apt.date === formatDate(yesterday));
        break;

      case 'today':
        filtered = allAppointments.filter(apt => apt.date === formatDate(today));
        break;

      case 'tomorrow':
        filtered = allAppointments.filter(apt => apt.date === formatDate(tomorrow));
        break;

      case 'custom':
        if (customDate) {
          filtered = allAppointments.filter(apt => apt.date === customDate);
        }
        break;

      default:
        filtered = allAppointments.filter(apt => apt.date === formatDate(today));
    }

    // Sort by time
    filtered.sort((a, b) => {
      const timeA = convertTo24Hour(a.time);
      const timeB = convertTo24Hour(b.time);
      return timeA.localeCompare(timeB);
    });

    setFilteredAppointments(filtered);
  }, [dateFilter, customDate, allAppointments, today, yesterday, tomorrow]);

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    if (filter !== 'custom') {
      setCustomDate('');
    }
  };

  const handleCustomDateChange = (date) => {
    setCustomDate(date);
    setDateFilter('custom');
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
    // TODO: Navigate to prescription page when implemented
    console.log('Navigating to prescription page for:', appointment.patientName);
    alert(`Prescription page for ${appointment.patientName} will be available soon!`);
  };

  const handleRescheduleClick = (appointment, e) => {
    e.stopPropagation(); // Prevent patient click event
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: appointment.date,
      time: appointment.time
    });
    setRescheduleModal(true);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would update the database
    console.log('Rescheduling appointment:', selectedAppointment, rescheduleData);
    
    // Close modal
    setRescheduleModal(false);
    setSelectedAppointment(null);
    
    // Show success message
    alert(`Appointment rescheduled for ${rescheduleData.date} at ${rescheduleData.time}`);
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
          {filteredAppointments.length > 0 ? (
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
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Reschedule
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
