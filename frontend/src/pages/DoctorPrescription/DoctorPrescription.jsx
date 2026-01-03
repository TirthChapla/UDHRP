import React, { useState } from 'react';
import { Search, User, FileText, Plus, Trash2, Calendar, Pill, Activity, AlertCircle, ChevronDown, ChevronRight, X, Menu } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Card from '../../components/Card/Card';
import './DoctorPrescription.css';

function DoctorPrescription() {
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openTabs, setOpenTabs] = useState([{ id: 'create', title: 'Create Prescription', type: 'create' }]);
  const [activeTab, setActiveTab] = useState('create');
  const [prescriptionsExpanded, setPrescriptionsExpanded] = useState(false);
  const [labReportsExpanded, setLabReportsExpanded] = useState(false);
  const [medications, setMedications] = useState([
    { id: 1, drug: '', unit: '', dosage: '' }
  ]);
  const [prescriptionData, setPrescriptionData] = useState({
    instructions: 'Take all medications as prescribed by the doctor. Follow the dosage instructions carefully.',
    dietToFollow: 'Stay hydrated. Avoid cold beverages. Rest adequately. Use steam inhalation twice daily.',
    allergies: 'None',
    followUp: 'If symptoms persist after 7 days'
  });

  // Mock patient data
  const mockPatient = {
    id: 'P12345',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 234-567-8900',
    email: 'john.doe@example.com',
    address: '123 Main Street, New York, NY 10001',
    allergies: 'None',
    chronicConditions: ['Hypertension']
  };

  // Mock previous prescriptions
  const mockPrescriptions = [
    {
      id: 'RX001',
      date: '2025-12-28',
      doctorName: 'Dr. Smith',
      medications: [
        { drug: 'Amoxicillin', unit: '500mg', dosage: 'Three times daily' },
        { drug: 'Ibuprofen', unit: '400mg', dosage: 'Twice daily after meals' }
      ],
      diagnosis: 'Upper Respiratory Infection',
      followUp: 'After 5 days'
    },
    {
      id: 'RX002',
      date: '2025-12-15',
      doctorName: 'Dr. Johnson',
      medications: [
        { drug: 'Lisinopril', unit: '10mg', dosage: 'Once daily in morning' }
      ],
      diagnosis: 'Hypertension Management',
      followUp: 'Monthly checkup'
    }
  ];

  // Mock lab reports
  const mockLabReports = [
    {
      id: 'LAB001',
      date: '2025-12-20',
      testName: 'Complete Blood Count',
      status: 'Normal',
      details: 'All parameters within normal range'
    },
    {
      id: 'LAB002',
      date: '2025-12-10',
      testName: 'Lipid Profile',
      status: 'Abnormal',
      details: 'Elevated LDL cholesterol - 165 mg/dL'
    }
  ];

  const handleSearchPatient = () => {
    if (patientId.trim()) {
      // In real app, fetch patient data from API
      setSelectedPatient(mockPatient);
    }
  };

  const handleAddMedication = () => {
    setMedications([...medications, { id: Date.now(), drug: '', unit: '', dosage: '' }]);
  };

  const handleRemoveMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const handleMedicationChange = (id, field, value) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handlePrescriptionChange = (field, value) => {
    setPrescriptionData({ ...prescriptionData, [field]: value });
  };

  const handleSubmitPrescription = () => {
    // Validate and submit prescription
    console.log('Submitting prescription:', {
      patient: selectedPatient,
      medications,
      ...prescriptionData,
      date: new Date().toISOString()
    });
    alert('Prescription submitted successfully!');
  };

  const openTab = (type, data) => {
    let tabId, tabTitle;
    
    if (type === 'profile') {
      tabId = 'profile';
      tabTitle = 'Patient Profile';
    } else if (type === 'prescription') {
      tabId = `rx-${data.id}`;
      tabTitle = `Prescription ${data.id}`;
    } else if (type === 'lab') {
      tabId = `lab-${data.id}`;
      tabTitle = `Lab Report ${data.id}`;
    }

    // Check if tab already exists
    const existingTab = openTabs.find(tab => tab.id === tabId);
    if (existingTab) {
      setActiveTab(tabId);
      return;
    }

    // Add new tab
    setOpenTabs([...openTabs, { id: tabId, title: tabTitle, type, data }]);
    setActiveTab(tabId);
  };

  const closeTab = (tabId) => {
    if (tabId === 'create') return; // Can't close main tab
    
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const renderTabContent = () => {
    const currentTab = openTabs.find(tab => tab.id === activeTab);
    
    if (!currentTab) return null;

    if (currentTab.type === 'create') {
      return renderCreatePrescription();
    } else if (currentTab.type === 'profile') {
      return renderPatientProfile();
    } else if (currentTab.type === 'prescription') {
      return renderPrescriptionView(currentTab.data);
    } else if (currentTab.type === 'lab') {
      return renderLabReportView(currentTab.data);
    }
  };

  const renderPatientProfile = () => (
    <Card className="prescription-form-card">
      <div className="form-section">
        <div className="section-header">
          <User size={20} />
          <h2>Patient Profile - {selectedPatient.name}</h2>
        </div>

        <div className="profile-detail-grid">
          <div className="profile-detail-item">
            <label>Patient ID</label>
            <p>{selectedPatient.id}</p>
          </div>
          <div className="profile-detail-item">
            <label>Full Name</label>
            <p>{selectedPatient.name}</p>
          </div>
          <div className="profile-detail-item">
            <label>Age</label>
            <p>{selectedPatient.age} years</p>
          </div>
          <div className="profile-detail-item">
            <label>Gender</label>
            <p>{selectedPatient.gender}</p>
          </div>
          <div className="profile-detail-item">
            <label>Blood Group</label>
            <p>{selectedPatient.bloodGroup}</p>
          </div>
          <div className="profile-detail-item">
            <label>Phone</label>
            <p>{selectedPatient.phone}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Email</label>
            <p>{selectedPatient.email}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Address</label>
            <p>{selectedPatient.address}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Allergies</label>
            <p className="alert-text">{selectedPatient.allergies}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Chronic Conditions</label>
            <p className="alert-text">{selectedPatient.chronicConditions.join(', ')}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderPrescriptionView = (data) => (
    <Card className="prescription-form-card">
      <div className="form-section">
        <div className="section-header">
          <FileText size={20} />
          <h2>Prescription - {data.id}</h2>
        </div>

        <div className="prescription-view-details">
          <div className="view-detail-row">
            <label>Date:</label>
            <span>{data.date}</span>
          </div>
          <div className="view-detail-row">
            <label>Doctor:</label>
            <span>{data.doctorName}</span>
          </div>
          <div className="view-detail-row">
            <label>Diagnosis:</label>
            <span>{data.diagnosis}</span>
          </div>

          <div className="medications-view-section">
            <h3>Medications</h3>
            <div className="medications-table">
              <div className="table-header">
                <div className="table-cell">S.</div>
                <div className="table-cell">Drugs</div>
                <div className="table-cell">Unit</div>
                <div className="table-cell">Dosage</div>
              </div>
              {data.medications.map((med, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">{med.drug}</div>
                  <div className="table-cell">{med.unit}</div>
                  <div className="table-cell">{med.dosage}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="view-detail-row">
            <label>Follow Up:</label>
            <span>{data.followUp}</span>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderLabReportView = (data) => (
    <Card className="prescription-form-card">
      <div className="form-section">
        <div className="section-header">
          <Activity size={20} />
          <h2>Lab Report - {data.id}</h2>
        </div>

        <div className="prescription-view-details">
          <div className="view-detail-row">
            <label>Date:</label>
            <span>{data.date}</span>
          </div>
          <div className="view-detail-row">
            <label>Test Name:</label>
            <span>{data.testName}</span>
          </div>
          <div className="view-detail-row">
            <label>Status:</label>
            <span className={`status-badge ${data.status.toLowerCase()}`}>{data.status}</span>
          </div>
          <div className="view-detail-row full-width">
            <label>Details:</label>
            <p>{data.details}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCreatePrescription = () => (
    <Card className="prescription-form-card">
      <div className="form-section">
        <div className="section-header">
          <Pill size={20} />
          <h2>Prescription</h2>
        </div>
        
        <div className="prescription-instructions">
          <label>Instructions</label>
          <textarea
            value={prescriptionData.instructions}
            onChange={(e) => handlePrescriptionChange('instructions', e.target.value)}
            rows={2}
          />
        </div>

        {/* Medications Table */}
        <div className="medications-section">
          <div className="section-title">
            <h3>Medications</h3>
            <Button
              variant="outline"
              size="small"
              onClick={handleAddMedication}
            >
              <Plus size={16} />
              Add Medication
            </Button>
          </div>

          <div className="medications-table">
            <div className="table-header">
              <div className="table-cell">S.</div>
              <div className="table-cell">Drugs</div>
              <div className="table-cell">Unit (Tablet / Syrup)</div>
              <div className="table-cell">Dosage (Per Day)</div>
              <div className="table-cell">Action</div>
            </div>
            {medications.map((med, index) => (
              <div key={med.id} className="table-row">
                <div className="table-cell">{index + 1}</div>
                <div className="table-cell">
                  <input
                    type="text"
                    placeholder="e.g., Cetirizine"
                    value={med.drug}
                    onChange={(e) => handleMedicationChange(med.id, 'drug', e.target.value)}
                  />
                </div>
                <div className="table-cell">
                  <input
                    type="text"
                    placeholder="e.g., 10mg"
                    value={med.unit}
                    onChange={(e) => handleMedicationChange(med.id, 'unit', e.target.value)}
                  />
                </div>
                <div className="table-cell">
                  <input
                    type="text"
                    placeholder="e.g., Once daily at night"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(med.id, 'dosage', e.target.value)}
                  />
                </div>
                <div className="table-cell">
                  <button
                    className="delete-btn"
                    onClick={() => handleRemoveMedication(med.id)}
                    disabled={medications.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diet To Follow */}
        <div className="form-group">
          <label>Diet To Follow</label>
          <textarea
            value={prescriptionData.dietToFollow}
            onChange={(e) => handlePrescriptionChange('dietToFollow', e.target.value)}
            rows={2}
            placeholder="Enter dietary instructions..."
          />
        </div>

        {/* Allergies */}
        <div className="form-group">
          <label>Allergies</label>
          <input
            type="text"
            value={prescriptionData.allergies}
            onChange={(e) => handlePrescriptionChange('allergies', e.target.value)}
            placeholder="Enter any allergies..."
          />
        </div>

        {/* Follow Up */}
        <div className="form-group">
          <label>Follow Up Provision</label>
          <input
            type="text"
            value={prescriptionData.followUp}
            onChange={(e) => handlePrescriptionChange('followUp', e.target.value)}
            placeholder="e.g., If symptoms persist after 7 days"
          />
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <Button
            variant="secondary"
            onClick={() => setSelectedPatient(null)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPrescription}
            size="large"
          >
            <FileText size={20} />
            Generate Prescription
          </Button>
        </div>
      </div>
    </Card>
  );

  if (!selectedPatient) {
    return (
      <div className="doctor-prescription-page">
        <div className="prescription-search-container">
          <Card className="search-patient-card">
            <div className="search-header">
              <div className="search-icon-wrapper">
                <FileText size={48} />
              </div>
              <h1>Create Prescription</h1>
              <p>Enter patient ID to start creating a prescription</p>
            </div>

            <div className="search-input-group">
              <Input
                label="Patient ID"
                placeholder="Enter patient ID (e.g., P12345)"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPatient()}
              />
              <Button
                onClick={handleSearchPatient}
                size="large"
                className="search-btn"
              >
                <Search size={20} />
                Search Patient
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-prescription-page">
      <div className="prescription-header">
        <div className="header-left">
          <Button
            variant="ghost"
            onClick={() => setSelectedPatient(null)}
          >
            ← Back to Search
          </Button>
          <h1>Create Prescription</h1>
        </div>
      </div>

      <div className="prescription-layout">
        {/* Sidebar Toggle Button */}
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          <Menu size={20} />
        </button>

        {/* Left Sidebar */}
        <aside className={`patient-sidebar ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
          {/* Navigation Buttons */}
          <div className="sidebar-nav">
            <button
              className="nav-btn"
              onClick={() => openTab('profile')}
            >
              <User size={18} />
              <span>Patient Profile</span>
            </button>

            {/* Previous Prescriptions */}
            <div className="nav-dropdown">
              <button
                className="nav-btn dropdown-toggle"
                onClick={() => setPrescriptionsExpanded(!prescriptionsExpanded)}
              >
                <FileText size={18} />
                <span>Previous Prescriptions</span>
                {prescriptionsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {prescriptionsExpanded && (
                <div className="dropdown-content">
                  {mockPrescriptions.map(rx => (
                    <button
                      key={rx.id}
                      className="dropdown-item"
                      onClick={() => openTab('prescription', rx)}
                    >
                      <span className="item-id">{rx.id}</span>
                      <span className="item-date">{rx.date}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Previous Lab Reports */}
            <div className="nav-dropdown">
              <button
                className="nav-btn dropdown-toggle"
                onClick={() => setLabReportsExpanded(!labReportsExpanded)}
              >
                <Activity size={18} />
                <span>Previous Lab Reports</span>
                {labReportsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {labReportsExpanded && (
                <div className="dropdown-content">
                  {mockLabReports.map(lab => (
                    <button
                      key={lab.id}
                      className="dropdown-item"
                      onClick={() => openTab('lab', lab)}
                    >
                      <span className="item-id">{lab.id}</span>
                      <span className="item-date">{lab.date}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content with Tabs */}
        <main className="prescription-main">
          {/* Tab Headers */}
          <div className="tabs-header">
            {openTabs.map(tab => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.title}</span>
                {tab.id !== 'create' && (
                  <button
                    className="tab-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tabs-content">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorPrescription;
