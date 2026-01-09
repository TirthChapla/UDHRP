import React, { useState, useEffect } from 'react';
import { Search, User, FileText, Plus, Trash2, Calendar, Pill, Activity, AlertCircle, ChevronDown, ChevronRight, X, Menu, Loader } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Card from '../../components/Card/Card';
import { getPatientById, getPatientPrescriptions, getPatientLabReports, createPrescription, createLabReport } from '../../services/doctorService';
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
  const [labReports, setLabReports] = useState([{ id: 1, name: '' }]);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    symptoms: '',
    instructions: 'Take all medications as prescribed by the doctor. Follow the dosage instructions carefully.',
    dietToFollow: 'Stay hydrated. Avoid cold beverages. Rest adequately.',
    allergies: '',
    followUp: '',
    followUpDate: '',
    labReports: []
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Patient history data from API
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [patientLabReports, setPatientLabReports] = useState([]);

  // Fetch patient history when patient is selected
  useEffect(() => {
    if (selectedPatient?.patientId) {
      fetchPatientHistory(selectedPatient.patientId);
      // Pre-fill allergies from patient data
      if (selectedPatient.allergies) {
        setPrescriptionData(prev => ({ ...prev, allergies: selectedPatient.allergies }));
      }
    }
  }, [selectedPatient]);

  const fetchPatientHistory = async (patientId) => {
    try {
      const [prescriptions, labReports] = await Promise.all([
        getPatientPrescriptions(patientId),
        getPatientLabReports(patientId)
      ]);
      setPatientPrescriptions(prescriptions || []);
      setPatientLabReports(labReports || []);
    } catch (error) {
      console.error('Error fetching patient history:', error);
    }
  };

  const handleSearchPatient = async () => {
    if (!patientId.trim()) {
      setSearchError('Please enter a patient ID');
      return;
    }

    setLoading(true);
    setSearchError('');

    try {
      const patient = await getPatientById(patientId.trim());
      setSelectedPatient(patient);
      setSearchError('');
    } catch (error) {
      console.error('Error searching patient:', error);
      setSearchError('Patient not found. Please check the patient ID and try again.');
      setSelectedPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setMedications([...medications, { id: Date.now(), drug: '', unit: '', dosage: '' }]);
  };

  const handleAddLabReport = () => {
    setLabReports([...labReports, { id: Date.now(), name: '' }]);
  };

  const handleRemoveLabReport = (id) => {
    if (labReports.length === 1) return;
    setLabReports(prev => prev.filter(r => r.id !== id));
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

  const handleSubmitPrescription = async () => {
    // Validate medications
    const validMedications = medications.filter(med => med.drug.trim() !== '');
    if (validMedications.length === 0) {
      alert('Please add at least one medication');
      return;
    }

    setSubmitLoading(true);

    try {
      // First, create any new lab reports and collect their IDs
      const labReportIds = [];
      const validLabReports = labReports.filter(r => r.name.trim() !== '');
      
      console.log('[DoctorPrescription] Creating lab reports:', validLabReports);
      
      for (const labReport of validLabReports) {
        try {
          const labReportPayload = {
            patientId: selectedPatient.patientId,
            testName: labReport.name,
            testDate: new Date().toISOString().split('T')[0],
            laboratoryName: 'Central Laboratory',
            results: '',
            doctorNotes: `Lab report created from prescription`
          };
          
          console.log('[DoctorPrescription] Creating lab report:', labReportPayload);
          const createdLabReport = await createLabReport(labReportPayload);
          
          if (createdLabReport && createdLabReport.data) {
            labReportIds.push(createdLabReport.data.id);
            console.log('[DoctorPrescription] Lab report created with ID:', createdLabReport.data.id);
          }
        } catch (labError) {
          console.error('[DoctorPrescription] Error creating lab report:', labError);
          const errorMessage = labError.message || labError.response?.data?.message || 'Failed to create lab report';
          alert(`${errorMessage}\n\nTest Type: ${labReport.name}`);
          setSubmitLoading(false);
          return;
        }
      }

      const prescriptionPayload = {
        patientId: selectedPatient.patientId,
        diagnosis: prescriptionData.diagnosis,
        symptoms: prescriptionData.symptoms,
        medications: validMedications.map(med => ({
          drug: med.drug,
          unit: med.unit,
          dosage: med.dosage
        })),
        instructions: prescriptionData.instructions,
        dietToFollow: prescriptionData.dietToFollow,
        allergies: prescriptionData.allergies,
        labReports: labReportIds.map(id => id.toString()),
        followUp: prescriptionData.followUp,
        followUpDate: prescriptionData.followUpDate
      };

      console.log('[DoctorPrescription] Submitting prescription with linked lab reports:', {
        patientId: prescriptionPayload.patientId,
        diagnosis: prescriptionPayload.diagnosis,
        symptoms: prescriptionPayload.symptoms,
        dietToFollow: prescriptionPayload.dietToFollow,
        instructions: prescriptionPayload.instructions,
        labReportIds: prescriptionPayload.labReports,
        labReportCount: prescriptionPayload.labReports.length,
        followUpDate: prescriptionPayload.followUpDate,
        medicationsCount: prescriptionPayload.medications.length
      });

      const result = await createPrescription(prescriptionPayload);
      console.log('[DoctorPrescription] Prescription created successfully:', result);
      alert(`Prescription created successfully! ID: ${result.prescriptionId}`);
      
      // Reset form
      setMedications([{ id: 1, drug: '', unit: '', dosage: '' }]);
      setLabReports([{ id: 1, name: '' }]);
      setPrescriptionData({
        diagnosis: '',
        symptoms: '',
        instructions: 'Take all medications as prescribed by the doctor. Follow the dosage instructions carefully.',
        dietToFollow: 'Stay hydrated. Avoid cold beverages. Rest adequately.',
        allergies: selectedPatient.allergies || '',
        followUp: '',
        followUpDate: '',
        labReports: []
      });
      
      // Refresh patient prescriptions
      fetchPatientHistory(selectedPatient.patientId);
    } catch (error) {
      console.error('[DoctorPrescription] Error creating prescription:', error);
      alert('Failed to create prescription. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setPatientId('');
    setPatientPrescriptions([]);
    setPatientLabReports([]);
    setOpenTabs([{ id: 'create', title: 'Create Prescription', type: 'create' }]);
    setActiveTab('create');
    setMedications([{ id: 1, drug: '', unit: '', dosage: '' }]);
    setLabReports([{ id: 1, name: '' }]);
    setPrescriptionData({
      diagnosis: '',
      symptoms: '',
      instructions: 'Take all medications as prescribed by the doctor. Follow the dosage instructions carefully.',
      dietToFollow: 'Stay hydrated. Avoid cold beverages. Rest adequately.',
      allergies: '',
      followUp: '',
      followUpDate: '',
      labReports: []
    });
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
            <p>{selectedPatient.patientId}</p>
          </div>
          <div className="profile-detail-item">
            <label>Full Name</label>
            <p>{selectedPatient.name}</p>
          </div>
          <div className="profile-detail-item">
            <label>Age</label>
            <p>{selectedPatient.age ? `${selectedPatient.age} years` : 'N/A'}</p>
          </div>
          <div className="profile-detail-item">
            <label>Gender</label>
            <p>{selectedPatient.gender || 'N/A'}</p>
          </div>
          <div className="profile-detail-item">
            <label>Blood Group</label>
            <p>{selectedPatient.bloodGroup || 'N/A'}</p>
          </div>
          <div className="profile-detail-item">
            <label>Phone</label>
            <p>{selectedPatient.phone || 'N/A'}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Email</label>
            <p>{selectedPatient.email || 'N/A'}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Address</label>
            <p>{selectedPatient.address || 'N/A'}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Allergies</label>
            <p className="alert-text">{selectedPatient.allergies || 'None reported'}</p>
          </div>
          <div className="profile-detail-item full-width">
            <label>Chronic Conditions</label>
            <p className="alert-text">{selectedPatient.chronicConditions?.length > 0 ? selectedPatient.chronicConditions.join(', ') : 'None reported'}</p>
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
          <h2>Prescription - {data.prescriptionId || data.id}</h2>
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
            <span>{data.diagnosis || 'N/A'}</span>
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

          {data.labReports && data.labReports.length > 0 && (
            <div className="view-detail-row full-width">
              <label>Lab Reports:</label>
              <span>{Array.isArray(data.labReports) ? data.labReports.join(', ') : data.labReports}</span>
            </div>
          )}

          <div className="view-detail-row">
            <label>Follow Up Date:</label>
            <span>{data.followUpDate || 'N/A'}</span>
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
          <h2>Lab Report - {data.reportId || data.id}</h2>
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
            <span className={`status-badge ${data.status?.toLowerCase()}`}>{data.status}</span>
          </div>
          <div className="view-detail-row full-width">
            <label>Results:</label>
            <p>{data.results || data.details || 'N/A'}</p>
          </div>
          {data.laboratoryName && (
            <div className="view-detail-row">
              <label>Laboratory:</label>
              <span>{data.laboratoryName}</span>
            </div>
          )}
          {data.doctorNotes && (
            <div className="view-detail-row full-width">
              <label>Doctor Notes:</label>
              <p>{data.doctorNotes}</p>
            </div>
          )}
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

        {/* Diagnosis */}
        <div className="form-group">
          <label>Diagnosis</label>
          <textarea
            value={prescriptionData.diagnosis}
            onChange={(e) => handlePrescriptionChange('diagnosis', e.target.value)}
            rows={2}
            placeholder="Enter diagnosis..."
          />
        </div>

        {/* Symptoms */}
        <div className="form-group">
          <label>Symptoms</label>
          <textarea
            value={prescriptionData.symptoms}
            onChange={(e) => handlePrescriptionChange('symptoms', e.target.value)}
            rows={2}
            placeholder="Enter patient symptoms..."
          />
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

        {/* Lab Reports */}
        <div className="lab-reports-section">
          <div className="section-title">
            <h3>Lab Reports</h3>
            <Button
              variant="outline"
              size="small"
              onClick={handleAddLabReport}
            >
              <Plus size={16} />
              Add Lab Report
            </Button>
          </div>
          <div className="lab-reports-list">
            {labReports.map((report, idx) => (
              <div key={report.id} className="lab-report-row">
                <select
                  value={report.name}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setLabReports(labReports.map(r => r.id === report.id ? { ...r, name: selectedType } : r));
                    console.log(`[Lab Report] Selected test type: ${selectedType}`);
                  }}
                  className="lab-report-select"
                >
                  <option value="">-- Select Lab Test Type --</option>
                  <option value="kidney-function-tests">Kidney Function Tests</option>
                  <option value="lipid-profile-test">Lipid Profile Test</option>
                  <option value="complete-blood-count">Complete Blood Count</option>
                  <option value="liver-function-tests">Liver Function Tests</option>
                  <option value="dengue-test">Dengue Test</option>
                  <option value="stool-routine">Stool Routine</option>
                  <option value="bleeding-time-clotting-time">Bleeding Time & Clotting Time</option>
                  <option value="pus-culture">Pus Culture</option>
                  <option value="bilirubin">Bilirubin (Total, Direct)</option>
                  <option value="serum-creatinine">Serum Creatinine</option>
                  <option value="erythrocyte-sedimentation-rate">ESR (Westergren)</option>
                  <option value="urine-routine">Urine Routine</option>
                  <option value="semen-analysis">Semen Analysis</option>
                  <option value="semen-culture">Semen Culture</option>
                  <option value="serum-proteins">Serum Proteins</option>
                  <option value="c-reactive-protein">C-Reactive Protein (CRP) Quantitative</option>
                  <option value="malaria-antigen">Malaria Antigen</option>
                  <option value="malaria-parasite">Malaria Parasite (MP Card)</option>
                  <option value="pt-inr">PT/INR (Prothrombin Time)</option>
                  <option value="prostate-specific-antigen">Prostate Specific Antigen (PSA)</option>
                  <option value="pap-smear">Pap Smear</option>
                  <option value="peripheral-blood-smear">Peripheral Blood Smear</option>
                </select>
                <div className="lab-report-actions">
                  <button
                    className="delete-btn"
                    onClick={() => {
                      handleRemoveLabReport(report.id);
                      console.log(`[Lab Report] Removed report: ${report.id}`);
                    }}
                    disabled={labReports.length === 1}
                    aria-label="Delete lab report"
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
          <label>Follow Up Date</label>
          <input
            type="date"
            value={prescriptionData.followUpDate}
            onChange={(e) => handlePrescriptionChange('followUpDate', e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <Button
            variant="secondary"
            onClick={handleClearPatient}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPrescription}
            size="large"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <Loader size={20} className="spin" />
                Creating...
              </>
            ) : (
              <>
                <FileText size={20} />
                Generate Prescription
              </>
            )}
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
                placeholder="Enter patient ID (e.g., PAT-XXXXXXXX)"
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value);
                  setSearchError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPatient()}
                error={searchError}
              />
              <Button
                onClick={handleSearchPatient}
                size="large"
                className="search-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search Patient
                  </>
                )}
              </Button>
            </div>
            {searchError && <p className="search-error">{searchError}</p>}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-prescription-page">
      <div className="prescription-header">
        {/* Sidebar Toggle Button */}
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          <Menu size={20} />
        </button>
        
        <div className="header-left">
          <h1>Create Prescription - {selectedPatient.name}</h1>
        </div>
      </div>

      <div className="prescription-layout">
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
                <span>Previous Prescriptions ({patientPrescriptions.length})</span>
                {prescriptionsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {prescriptionsExpanded && (
                <div className="dropdown-content">
                  {patientPrescriptions.length === 0 ? (
                    <p className="no-data-text">No previous prescriptions</p>
                  ) : (
                    patientPrescriptions.map(rx => (
                      <button
                        key={rx.id}
                        className="dropdown-item"
                        onClick={() => openTab('prescription', rx)}
                      >
                        <span className="item-id">{rx.prescriptionId || rx.id}</span>
                        <span className="item-date">{rx.date}</span>
                      </button>
                    ))
                  )}
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
                <span>Previous Lab Reports ({patientLabReports.length})</span>
                {labReportsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {labReportsExpanded && (
                <div className="dropdown-content">
                  {patientLabReports.length === 0 ? (
                    <p className="no-data-text">No previous lab reports</p>
                  ) : (
                    patientLabReports.map(lab => (
                      <button
                        key={lab.id}
                        className="dropdown-item"
                        onClick={() => openTab('lab', lab)}
                      >
                        <span className="item-id">{lab.reportId || lab.id}</span>
                        <span className="item-date">{lab.date}</span>
                      </button>
                    ))
                  )}
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
