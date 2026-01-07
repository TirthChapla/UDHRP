import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardOverview from '../../components/DashboardOverview/DashboardOverview';
import AppointmentsSection from '../../components/AppointmentsSection/AppointmentsSection';
import BookingModal from '../../components/BookingModal/BookingModal';
import PrescriptionCard from '../../components/PrescriptionCard/PrescriptionCard';
import PrescriptionModal from '../../components/PrescriptionModal/PrescriptionModal';
import PrescriptionFilters from '../../components/PrescriptionFilters/PrescriptionFilters';
import LabReportCard from '../../components/LabReportCard/LabReportCard';
import LabReportModal from '../../components/LabReportModal/LabReportModal';
import DoctorSearch from '../DoctorSearch/DoctorSearch';
import PatientProfile from '../PatientProfile/PatientProfile';
import { 
  getPrescriptions, 
  getDoctorsFromPrescriptions, 
  getYearsFromPrescriptions, 
  filterPrescriptions,
  downloadPrescriptionPDF,
  getLabReports,
  getDoctorsFromLabReports,
  getYearsFromLabReports,
  filterLabReports,
  downloadLabReportPDF,
  bookAppointment,
  getUpcomingAppointments,
  cancelAppointment
} from '../../services/patientService';
import { FileText, FlaskRound } from 'lucide-react';
import Card from '../../components/Card/Card';
import './PatientDashboard.css';

function PatientDashboard({ searchQuery, initialTab }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Appointments state
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  
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
  const [prescriptionDoctors, setPrescriptionDoctors] = useState([]);
  const [prescriptionYears, setPrescriptionYears] = useState([]);

  // Lab Reports state
  const [allLabReports, setAllLabReports] = useState([]);
  const [filteredLabReports, setFilteredLabReports] = useState([]);
  const [labReportsLoading, setLabReportsLoading] = useState(false);
  const [selectedLabReport, setSelectedLabReport] = useState(null);
  const [showLabReportModal, setShowLabReportModal] = useState(false);
  const [showRelatedLabReportsModal, setShowRelatedLabReportsModal] = useState(false);
  const [relatedLabReports, setRelatedLabReports] = useState([]);
  const [labReportSearchQuery, setLabReportSearchQuery] = useState('');
  const [selectedLabReportDoctor, setSelectedLabReportDoctor] = useState('all');
  const [selectedLabReportMonth, setSelectedLabReportMonth] = useState('all');
  const [selectedLabReportYear, setSelectedLabReportYear] = useState('all');
  const [labReportDoctors, setLabReportDoctors] = useState([]);
  const [labReportYears, setLabReportYears] = useState([]);

  // Handle navigation from search in navbar
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    if (location.state?.searchQuery) {
      setInitialSearchQuery(location.state.searchQuery);
    }
  }, [location]);

  // Handle initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Handle search query prop changes
  useEffect(() => {
    if (searchQuery) {
      setActiveTab('search-doctors');
      setInitialSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Fetch appointments on mount and when tab changes
  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    if (activeTab === 'appointments' || activeTab === 'overview') {
      loadAppointments();
    }
  }, [activeTab]);

  // Fetch prescriptions when records tab is active
  useEffect(() => {
    if (activeTab === 'records') {
      loadPrescriptions();
    }
  }, [activeTab]);

  // Fetch lab reports when labs tab is active
  useEffect(() => {
    if (activeTab === 'labs') {
      loadLabReports();
    }
  }, [activeTab]);

  // Filter prescriptions when filters change
  useEffect(() => {
    const applyFilters = async () => {
      if (prescriptionSearchQuery || selectedPrescriptionDoctor !== 'all' || selectedMonth !== 'all' || selectedYear !== 'all') {
        try {
          const filtered = await filterPrescriptions({
            searchQuery: prescriptionSearchQuery,
            doctorName: selectedPrescriptionDoctor,
            month: selectedMonth,
            year: selectedYear
          });
          setFilteredPrescriptions(filtered);
        } catch (error) {
          console.error('Failed to filter prescriptions:', error);
        }
      } else {
        setFilteredPrescriptions(allPrescriptions);
      }
    };
    
    if (allPrescriptions.length > 0) {
      applyFilters();
    }
  }, [allPrescriptions, prescriptionSearchQuery, selectedPrescriptionDoctor, selectedMonth, selectedYear]);

  // Filter lab reports when filters change
  useEffect(() => {
    const applyFilters = async () => {
      if (labReportSearchQuery || selectedLabReportDoctor !== 'all' || selectedLabReportMonth !== 'all' || selectedLabReportYear !== 'all') {
        try {
          const filtered = await filterLabReports({
            searchQuery: labReportSearchQuery,
            doctorName: selectedLabReportDoctor,
            month: selectedLabReportMonth,
            year: selectedLabReportYear,
            status: 'all'
          });
          setFilteredLabReports(filtered);
        } catch (error) {
          console.error('Failed to filter lab reports:', error);
        }
      } else {
        setFilteredLabReports(allLabReports);
      }
    };
    
    if (allLabReports.length > 0) {
      applyFilters();
    }
  }, [allLabReports, labReportSearchQuery, selectedLabReportDoctor, selectedLabReportMonth, selectedLabReportYear]);

  // Load appointments from API
  const loadAppointments = async () => {
    setAppointmentsLoading(true);
    try {
      const data = await getUpcomingAppointments();
      // Transform the data to match the expected format
      const formattedAppointments = (data || []).map(apt => ({
        id: apt.id,
        doctorName: apt.doctorName,
        specialization: apt.doctorSpecialization,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        location: apt.reason || 'In-person consultation',
        type: apt.type
      }));
      setUpcomingAppointments(formattedAppointments);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      // Keep existing data on error
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Load prescriptions from service
  const loadPrescriptions = async () => {
    setPrescriptionsLoading(true);
    try {
      const data = await getPrescriptions();
      setAllPrescriptions(data);
      setFilteredPrescriptions(data);
      
      // Load doctors and years for filters
      const doctors = await getDoctorsFromPrescriptions();
      const years = await getYearsFromPrescriptions();
      setPrescriptionDoctors(doctors);
      setPrescriptionYears(years);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      // TODO: Show error notification
    } finally {
      setPrescriptionsLoading(false);
    }
  };

  // Load lab reports from service
  const loadLabReports = async () => {
    setLabReportsLoading(true);
    try {
      const data = await getLabReports();
      setAllLabReports(data);
      setFilteredLabReports(data);
      
      // Load doctors and years for filters
      const doctors = await getDoctorsFromLabReports();
      const years = await getYearsFromLabReports();
      setLabReportDoctors(doctors);
      setLabReportYears(years);
    } catch (error) {
      console.error('Failed to load lab reports:', error);
      // TODO: Show error notification
    } finally {
      setLabReportsLoading(false);
    }
  };

  // Mock data
  const healthScore = 92;

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
      message: 'Consider increasing your daily water intake to 8 glasses.',
      type: 'info'
    },
    {
      title: 'Preventive Care',
      message: 'Schedule your annual eye checkup this month.',
      type: 'warning'
    }
  ];

  // Get data for filters
  const doctorsWhoTreatedPatient = prescriptionDoctors;
  const years = prescriptionYears;
  const doctorsWhoOrderedTests = labReportDoctors;
  const labYears = labReportYears;

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

  // Lab report handlers
  const handleViewLabReport = (report) => {
    setSelectedLabReport(report);
    setShowLabReportModal(true);
  };

  const handleCloseLabReportModal = () => {
    setShowLabReportModal(false);
    setSelectedLabReport(null);
  };

  const handleDownloadLabReport = async (report) => {
    try {
      await downloadLabReportPDF(report);
    } catch (error) {
      console.error('Failed to download lab report:', error);
      // TODO: Show error notification
    }
  };

  const handleClearLabReportFilters = () => {
    setLabReportSearchQuery('');
    setSelectedLabReportDoctor('all');
    setSelectedLabReportMonth('all');
    setSelectedLabReportYear('all');
  };

  const handleViewLabReportsFromPrescription = (labReportIds) => {
    // Get the related lab reports
    const reports = allLabReports.filter(report => labReportIds.includes(report.id));
    setRelatedLabReports(reports);
    setShowRelatedLabReportsModal(true);
  };

  const handleCloseRelatedLabReportsModal = () => {
    setShowRelatedLabReportsModal(false);
    setRelatedLabReports([]);
  };

  const handleViewLabReportFromList = (report) => {
    setSelectedLabReport(report);
    setShowLabReportModal(true);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert('Please select date and time');
      return;
    }

    setBookingLoading(true);
    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        date: appointmentDate,
        time: appointmentTime,
        type: 'IN_PERSON',
        reason: `Consultation with ${selectedDoctor.specialization}`
      };
      
      console.log('Booking appointment with data:', appointmentData);
      console.log('Selected doctor:', selectedDoctor);
      
      const result = await bookAppointment(appointmentData);
      console.log('Booking result:', result);
      
      alert(`Appointment booked successfully with ${selectedDoctor?.name} on ${appointmentDate} at ${appointmentTime}`);
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setAppointmentDate('');
      setAppointmentTime('');
      
      // Refresh appointments list
      loadAppointments();
      setActiveTab('appointments');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      await cancelAppointment(appointmentId);
      alert('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert(error.message || 'Failed to cancel appointment. Please try again.');
    }
  };

  return (
    <div className="patient-dashboard">
      {/* Main Content */}
      <div className="patient-main-content">
        {activeTab === 'profile' && <PatientProfile />}

        {activeTab === 'search-doctors' && (
          <DoctorSearch 
            onBookAppointment={handleBookAppointment} 
            initialSearchQuery={initialSearchQuery}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsSection 
            appointments={upcomingAppointments}
            onBookNew={() => setActiveTab('search-doctors')}
            onCancel={handleCancelAppointment}
            loading={appointmentsLoading}
          />
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
                    onViewLabReport={handleViewLabReport}
                    labReports={allLabReports}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="prescriptions-section">
            <div className="section-header">
              <h1 className="section-title">
                <FlaskRound size={28} />
                Lab Reports
              </h1>
              <div className="prescription-count">
                {filteredLabReports.length} report{filteredLabReports.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <PrescriptionFilters
              searchQuery={labReportSearchQuery}
              onSearchChange={setLabReportSearchQuery}
              selectedDoctor={selectedLabReportDoctor}
              onDoctorChange={setSelectedLabReportDoctor}
              selectedMonth={selectedLabReportMonth}
              onMonthChange={setSelectedLabReportMonth}
              selectedYear={selectedLabReportYear}
              onYearChange={setSelectedLabReportYear}
              doctorsList={doctorsWhoOrderedTests}
              yearsList={labYears}
              onClearFilters={handleClearLabReportFilters}
            />

            {labReportsLoading ? (
              <Card className="empty-state">
                <p>Loading lab reports...</p>
              </Card>
            ) : filteredLabReports.length === 0 ? (
              <Card className="empty-state">
                <FlaskRound size={64} />
                <h3>No lab reports found</h3>
                <p>Try adjusting your search or filters</p>
              </Card>
            ) : (
              <div className="prescriptions-grid">
                {filteredLabReports.map(report => (
                  <LabReportCard
                    key={report.id}
                    report={report}
                    onViewDetails={handleViewLabReport}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <DashboardOverview
            healthScore={healthScore}
            appointments={upcomingAppointments}
            healthMetrics={healthMetrics}
            aiInsights={aiInsights}
            reminders={reminders}
            recentRecords={recentRecords}
            onBookAppointment={() => setActiveTab('search-doctors')}
            onTabChange={setActiveTab}
          />
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          onDateChange={setAppointmentDate}
          onTimeChange={setAppointmentTime}
          onConfirm={handleConfirmBooking}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
            setAppointmentDate('');
            setAppointmentTime('');
          }}
          loading={bookingLoading}
        />
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={handleClosePrescriptionModal}
          onDownload={handleDownloadPrescription}
        />
      )}

      {/* Lab Report Modal */}
      {showLabReportModal && selectedLabReport && (
        <LabReportModal
          report={selectedLabReport}
          onClose={handleCloseLabReportModal}
          onDownload={handleDownloadLabReport}
        />
      )}

      {/* Related Lab Reports Modal */}
      {showRelatedLabReportsModal && relatedLabReports.length > 0 && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseRelatedLabReportsModal();
          }
        }}>
          <div className="related-reports-modal">
            <div className="related-reports-header">
              <h2>Related Lab Reports ({relatedLabReports.length})</h2>
              <button className="close-button" onClick={handleCloseRelatedLabReportsModal}>
                <X size={24} />
              </button>
            </div>
            <div className="related-reports-content">
              {relatedLabReports.map(report => (
                <div key={report.id} className="related-report-item" onClick={() => handleViewLabReportFromList(report)}>
                  <div className="report-icon">
                    <FlaskRound size={32} />
                  </div>
                  <div className="report-info">
                    <h3>{report.testName}</h3>
                    <p className="report-lab">{report.labName}</p>
                    <div className="report-meta">
                      <span><Calendar size={14} /> {new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span className={`status-badge status-${report.status}`}>{report.status}</span>
                    </div>
                  </div>
                  <div className="view-arrow">
                    <FileText size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
