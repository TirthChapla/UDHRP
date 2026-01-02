import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Bell, 
  Activity, 
  User,
  Search,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Home,
  Stethoscope,
  FlaskRound,
  X
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import PrescriptionCard from '../../components/PrescriptionCard/PrescriptionCard';
import PrescriptionModal from '../../components/PrescriptionModal/PrescriptionModal';
import PrescriptionFilters from '../../components/PrescriptionFilters/PrescriptionFilters';
import DoctorSearch from '../DoctorSearch/DoctorSearch';
import PatientProfile from '../PatientProfile/PatientProfile';
import { 
  getPrescriptions, 
  getDoctorsFromPrescriptions, 
  getYearsFromPrescriptions, 
  filterPrescriptions,
  downloadPrescriptionPDF 
} from '../../services/patientService';
import './PatientDashboard.css';

function PatientDashboard({ searchQuery }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  
  // Prescriptions state
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionSearchQuery, setPrescriptionSearchQuery] = useState('');
  const [selectedPrescriptionDoctor, setSelectedPrescriptionDoctor] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Handle navigation from search in navbar
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    if (location.state?.searchQuery) {
      setInitialSearchQuery(location.state.searchQuery);
    }
  }, [location]);

  // Handle search query prop changes
  useEffect(() => {
    if (searchQuery) {
      setActiveTab('search-doctors');
      setInitialSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Fetch prescriptions when records tab is active
  useEffect(() => {
    if (activeTab === 'records') {
      loadPrescriptions();
    }
  }, [activeTab]);

  // Filter prescriptions when filters change
  useEffect(() => {
    if (allPrescriptions.length > 0) {
      const filtered = filterPrescriptions(allPrescriptions, {
        searchQuery: prescriptionSearchQuery,
        doctorName: selectedPrescriptionDoctor,
        month: selectedMonth,
        year: selectedYear
      });
      setFilteredPrescriptions(filtered);
    }
  }, [allPrescriptions, prescriptionSearchQuery, selectedPrescriptionDoctor, selectedMonth, selectedYear]);

  // Load prescriptions from service
  const loadPrescriptions = async () => {
    setPrescriptionsLoading(true);
    try {
      const data = await getPrescriptions('patient-123'); // TODO: Use actual patient ID
      setAllPrescriptions(data);
      setFilteredPrescriptions(data);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      // TODO: Show error notification
    } finally {
      setPrescriptionsLoading(false);
    }
  };

  // Mock data
  const healthScore = 92;
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Patel',
      specialization: 'Cardiologist',
      date: '2025-12-28',
      time: '10:00 AM',
      status: 'confirmed',
      location: 'Apollo Hospital, Mumbai'
    },
    {
      id: 2,
      doctorName: 'Dr. Rajesh Kumar',
      specialization: 'General Physician',
      date: '2026-01-05',
      time: '2:30 PM',
      status: 'pending',
      location: 'Fortis Clinic, Andheri'
    }
  ];

  const recentRecords = [
    {
      id: 1,
      type: 'Prescription',
      doctor: 'Dr. Sarah Patel',
      date: '2025-12-15',
      title: 'Cardiology Consultation'
    },
    {
      id: 2,
      type: 'Lab Report',
      lab: 'Metropolis Healthcare',
      date: '2025-12-10',
      title: 'Complete Blood Count'
    },
    {
      id: 3,
      type: 'Prescription',
      doctor: 'Dr. Amit Sharma',
      date: '2025-11-28',
      title: 'Follow-up Consultation'
    }
  ];

  const reminders = [
    {
      id: 1,
      type: 'vaccination',
      title: 'COVID-19 Booster',
      dueDate: '2026-01-15',
      priority: 'high'
    },
    {
      id: 2,
      type: 'checkup',
      title: 'Annual Health Checkup',
      dueDate: '2026-02-01',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'test',
      title: 'Lipid Profile Test',
      dueDate: '2026-01-20',
      priority: 'medium'
    }
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
    { label: 'BMI', value: '23.4', unit: 'kg/m²', status: 'normal' },
    { label: 'Blood Sugar', value: '95', unit: 'mg/dL', status: 'normal' }
  ];

  const aiInsights = [
    {
      title: 'Cardiovascular Health',
      message: 'Your heart health metrics are excellent. Continue your current exercise routine.',
      type: 'success'
    },
    {
      title: 'Nutrition Recommendation',
      message: 'Consider increasing omega-3 intake for better brain health.',
      type: 'info'
    },
    {
      title: 'Preventive Care',
      message: 'Schedule your annual eye checkup this month.',
      type: 'warning'
    }
  ];

  // Get data for filters
  const doctorsWhoTreatedPatient = getDoctorsFromPrescriptions(allPrescriptions);
  const years = getYearsFromPrescriptions(allPrescriptions);

  // Handlers
  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handleClosePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedPrescription(null);
  };

  const handleDownloadPrescription = async (prescription) => {
    try {
      await downloadPrescriptionPDF(prescription);
    } catch (error) {
      console.error('Failed to download prescription:', error);
      // TODO: Show error notification
    }
  };

  const handleClearFilters = () => {
    setPrescriptionSearchQuery('');
    setSelectedPrescriptionDoctor('all');
    setSelectedMonth('all');
    setSelectedYear('all');
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    setActiveTab('overview');
  };

  const handleConfirmBooking = () => {
    if (!appointmentDate || !appointmentTime) {
      alert('Please select date and time');
      return;
    }
    alert(`Appointment booked with ${selectedDoctor?.name} on ${appointmentDate} at ${appointmentTime}`);
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setAppointmentDate('');
    setAppointmentTime('');
  };

  return (
    <div className="patient-dashboard">
      {/* Patient Sidebar Navigation */}
      <div className="patient-sidebar">
        <div className="sidebar-header">
          <Heart size={28} />
          <h2>Patient Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>My Profile</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'search-doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('search-doctors')}
          >
            <Stethoscope size={20} />
            <span>Find Doctors</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={20} />
            <span>My Appointments</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <FileText size={20} />
            <span>Medical Records</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'labs' ? 'active' : ''}`}
            onClick={() => setActiveTab('labs')}
          >
            <FlaskRound size={20} />
            <span>Lab Reports</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="patient-main-content">
        {activeTab === 'profile' && (
          <PatientProfile />
        )}

        {activeTab === 'search-doctors' && (
          <DoctorSearch 
            onBookAppointment={handleBookAppointment} 
            initialSearchQuery={initialSearchQuery}
          />
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <div className="section-header">
              <h1 className="section-title">My Appointments</h1>
              <Button 
                icon={<Calendar size={20} />}
                onClick={() => setActiveTab('search-doctors')}
              >
                Book New Appointment
              </Button>
            </div>

            <div className="appointments-list-detailed">
              {upcomingAppointments.map(appointment => (
                <Card key={appointment.id} className="appointment-card-detailed">
                  <div className="appointment-card-header">
                    <div className="doctor-info-detailed">
                      <div className="doctor-avatar-small">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <h3>{appointment.doctorName}</h3>
                        <p className="specialization-text">{appointment.specialization}</p>
                      </div>
                    </div>
                    <div className={`status-badge badge-${appointment.status}`}>
                      {appointment.status}
                    </div>
                  </div>
                  <div className="appointment-details-grid">
                    <div className="detail-item">
                      <Calendar size={18} />
                      <span>{new Date(appointment.date).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={18} />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={18} />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <Button variant="outline" size="small">Reschedule</Button>
                    <Button variant="danger" size="small">Cancel</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="prescriptions-section">
            <div className="section-header">
              <h1 className="section-title">
                <FileText size={28} />
                My Prescriptions
              </h1>
              <div className="prescription-count">
                {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Filters Component */}
            <PrescriptionFilters
              searchQuery={prescriptionSearchQuery}
              onSearchChange={setPrescriptionSearchQuery}
              selectedDoctor={selectedPrescriptionDoctor}
              onDoctorChange={setSelectedPrescriptionDoctor}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              doctorsList={doctorsWhoTreatedPatient}
              yearsList={years}
              onClearFilters={handleClearFilters}
            />

            {/* Loading State */}
            {prescriptionsLoading ? (
              <Card className="empty-state">
                <p>Loading prescriptions...</p>
              </Card>
            ) : filteredPrescriptions.length === 0 ? (
              <Card className="empty-state">
                <FileText size={64} />
                <h3>No prescriptions found</h3>
                <p>Try adjusting your search or filters</p>
              </Card>
            ) : (
              <div className="prescriptions-grid">
                {filteredPrescriptions.map(prescription => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    onViewDetails={handleViewPrescription}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            <div className="dashboard-header">
              <div>
                <h1 className="dashboard-title">Welcome back, John!</h1>
                <p className="dashboard-subtitle">Here's your health overview</p>
              </div>
              <Button 
                icon={<Calendar size={20} />}
                onClick={() => setActiveTab('search-doctors')}
              >
                Book Appointment
              </Button>
            </div>

      <div className="dashboard-stats">
        <Card className="stat-card stat-card-primary">
          <div className="stat-icon">
            <Heart />
          </div>
          <div className="stat-content">
            <div className="stat-label">Health Score</div>
            <div className="stat-value">{healthScore}%</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              <span>+5% from last month</span>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Calendar />
          </div>
          <div className="stat-content">
            <div className="stat-label">Appointments</div>
            <div className="stat-value">{upcomingAppointments.length}</div>
            <div className="stat-description">Upcoming this month</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <FileText />
          </div>
          <div className="stat-content">
            <div className="stat-label">Medical Records</div>
            <div className="stat-value">156</div>
            <div className="stat-description">Total documents</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Bell />
          </div>
          <div className="stat-content">
            <div className="stat-label">Reminders</div>
            <div className="stat-value">{reminders.length}</div>
            <div className="stat-description">Pending actions</div>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Health Metrics */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Activity size={24} />
                Health Metrics
              </h3>
            </div>
            <div className="health-metrics-grid">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="health-metric">
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-value">
                    {metric.value}
                    <span className="metric-unit">{metric.unit}</span>
                  </div>
                  <div className={`metric-status status-${metric.status}`}>
                    <CheckCircle2 size={14} />
                    Normal
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Calendar size={24} />
                Upcoming Appointments
              </h3>
              <Button variant="ghost" size="small">View All</Button>
            </div>
            <div className="appointments-list">
              {upcomingAppointments.map(appointment => (
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

          {/* AI Insights */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Activity size={24} />
                AI Health Insights
              </h3>
            </div>
            <div className="ai-insights-list">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`ai-insight insight-${insight.type}`}>
                  <div className="insight-icon">
                    <AlertCircle size={20} />
                  </div>
                  <div className="insight-content">
                    <div className="insight-title">{insight.title}</div>
                    <div className="insight-message">{insight.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="dashboard-sidebar">
          {/* Reminders */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Bell size={24} />
                Reminders
              </h3>
            </div>
            <div className="reminders-list">
              {reminders.map(reminder => (
                <div key={reminder.id} className="reminder-item">
                  <div className={`reminder-priority priority-${reminder.priority}`}></div>
                  <div className="reminder-content">
                    <div className="reminder-title">{reminder.title}</div>
                    <div className="reminder-date">
                      Due: {new Date(reminder.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Records */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <FileText size={24} />
                Recent Records
              </h3>
            </div>
            <div className="records-list">
              {recentRecords.map(record => (
                <div key={record.id} className="record-item">
                  <div className="record-icon">
                    <FileText size={20} />
                  </div>
                  <div className="record-content">
                    <div className="record-title">{record.title}</div>
                    <div className="record-meta">
                      {record.doctor || record.lab} • {new Date(record.date).toLocaleDateString()}
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
              <Button 
                variant="outline" 
                fullWidth 
                icon={<Search size={18} />}
                onClick={() => setActiveTab('search-doctors')}
              >
                Find Doctor
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                icon={<FileText size={18} />}
                onClick={() => setActiveTab('records')}
              >
                View Records
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                icon={<User size={18} />}
                onClick={() => setActiveTab('profile')}
              >
                Update Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
          </>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <Card className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowBookingModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="selected-doctor-info">
                <div className="doctor-avatar-modal">
                  <Stethoscope size={32} />
                </div>
                <div>
                  <h3>{selectedDoctor.name}</h3>
                  <p>{selectedDoctor.specialization}</p>
                  <div className="doctor-rating-modal">
                    <Star size={16} fill="currentColor" />
                    {selectedDoctor.rating} ({selectedDoctor.reviews} reviews)
                  </div>
                </div>
              </div>

              <div className="booking-form">
                <Input
                  type="date"
                  label="Select Date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Input
                  type="time"
                  label="Select Time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
                
                <div className="consultation-fee-info">
                  <span>Consultation Fee:</span>
                  <strong>₹{selectedDoctor.consultationFee}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button 
                variant="outline" 
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking}>
                Confirm Booking
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Prescription Detail Modal */}
      {showPrescriptionModal && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={handleClosePrescriptionModal}
          onDownload={handleDownloadPrescription}
        />
      )}
    </div>
  );
}

export default PatientDashboard;
