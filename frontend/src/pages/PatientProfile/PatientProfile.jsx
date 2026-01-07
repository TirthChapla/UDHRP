import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Shield, 
  Heart, 
  Users, 
  Droplet, 
  MapPin, 
  Building2,
  FileText,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Edit,
  Save,
  X as XIcon,
  Lock
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import { getPatientProfile, updatePatientProfile } from '../../services/patientService';
import './PatientProfile.css';

function PatientProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    patientId: '',
    isAlive: true,
    deathReason: '',
    motherHealthId: '',
    fatherHealthId: '',
    parentsAllergies: '',
    hasNoParentInfo: false,
    bloodGroup: '',
    birthPlace: '',
    hospitalName: '',
    specificInstructions: '',
    height: '',
    weight: '',
    allergies: '',
    chronicDiseases: '',
    emergencyContact: '',
    insuranceProvider: '',
    insuranceNumber: '',
    // New fields
    occupation: '',
    cellNo: '',
    healthInsuranceNo: '',
    healthCareProvider: '',
    healthCardNo: '',
    bloodPressure: '',
    pulseRate: ''
  });

  const [siblings, setSiblings] = useState([]);
  
  // Keep original data for cancel functionality
  const [originalData, setOriginalData] = useState({ ...formData });
  const [originalSiblings, setOriginalSiblings] = useState([...siblings]);

  // Fetch patient profile on component mount
  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientProfile();
      
      console.log('Fetched patient profile data:', data);
      
      // Map backend data to frontend format
      const mappedData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        patientId: data.patientId || '',
        isAlive: data.isAlive !== undefined ? data.isAlive : true,
        deathReason: data.deathReason || '',
        motherHealthId: data.motherHealthId || '',
        fatherHealthId: data.fatherHealthId || '',
        parentsAllergies: data.parentsAllergies || '',
        hasNoParentInfo: data.hasNoParentInfo || false,
        bloodGroup: data.bloodGroup || '',
        birthPlace: data.birthPlace || '',
        hospitalName: data.hospitalName || '',
        specificInstructions: data.specificInstructions || '',
        height: data.height || '',
        weight: data.weight || '',
        allergies: data.allergies || '',
        chronicDiseases: data.chronicDiseases || '',
        emergencyContact: data.emergencyContact || '',
        insuranceProvider: data.insuranceProvider || '',
        insuranceNumber: data.insuranceNumber || '',
        // New fields
        occupation: data.occupation || '',
        cellNo: data.cellNo || '',
        healthInsuranceNo: data.healthInsuranceNo || '',
        healthCareProvider: data.healthCareProvider || '',
        healthCardNo: data.healthCardNo || '',
        bloodPressure: data.bloodPressure || '',
        pulseRate: data.pulseRate || ''
      };
      
      console.log('Mapped form data:', mappedData);
      
      setFormData(mappedData);
      setSiblings(data.siblings || []);
      setOriginalData(mappedData);
      setOriginalSiblings(data.siblings || []);
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      setError('Failed to load patient profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSiblingChange = (index, value) => {
    const newSiblings = [...siblings];
    newSiblings[index] = value;
    setSiblings(newSiblings);
  };

  const addSibling = () => {
    setSiblings([...siblings, '']);
  };

  const removeSibling = (index) => {
    const newSiblings = siblings.filter((_, i) => i !== index);
    setSiblings(newSiblings);
  };

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setOriginalSiblings([...siblings]);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setSiblings([...originalSiblings]);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const profileData = {
        ...formData,
        siblings: siblings.filter(id => id.trim() !== '')
      };
      
      const updatedProfile = await updatePatientProfile(profileData);
      
      // Update local state with returned data
      const mappedData = {
        firstName: updatedProfile.firstName || '',
        lastName: updatedProfile.lastName || '',
        phoneNumber: updatedProfile.phoneNumber || '',
        dateOfBirth: updatedProfile.dateOfBirth || '',
        gender: updatedProfile.gender || '',
        address: updatedProfile.address || '',
        city: updatedProfile.city || '',
        state: updatedProfile.state || '',
        zipCode: updatedProfile.zipCode || '',
        patientId: updatedProfile.patientId || '',
        isAlive: updatedProfile.isAlive !== undefined ? updatedProfile.isAlive : true,
        deathReason: updatedProfile.deathReason || '',
        motherHealthId: updatedProfile.motherHealthId || '',
        fatherHealthId: updatedProfile.fatherHealthId || '',
        parentsAllergies: updatedProfile.parentsAllergies || '',
        hasNoParentInfo: updatedProfile.hasNoParentInfo || false,
        bloodGroup: updatedProfile.bloodGroup || '',
        birthPlace: updatedProfile.birthPlace || '',
        hospitalName: updatedProfile.hospitalName || '',
        specificInstructions: updatedProfile.specificInstructions || '',
        height: updatedProfile.height || '',
        weight: updatedProfile.weight || '',
        allergies: updatedProfile.allergies || '',
        chronicDiseases: updatedProfile.chronicDiseases || '',
        emergencyContact: updatedProfile.emergencyContact || '',
        insuranceProvider: updatedProfile.insuranceProvider || '',
        insuranceNumber: updatedProfile.insuranceNumber || '',
        // New fields
        occupation: updatedProfile.occupation || '',
        cellNo: updatedProfile.cellNo || '',
        healthInsuranceNo: updatedProfile.healthInsuranceNo || '',
        healthCareProvider: updatedProfile.healthCareProvider || '',
        healthCardNo: updatedProfile.healthCardNo || '',
        bloodPressure: updatedProfile.bloodPressure || '',
        pulseRate: updatedProfile.pulseRate || ''
      };
      
      setFormData(mappedData);
      setSiblings(updatedProfile.siblings || []);
      setOriginalData(mappedData);
      setOriginalSiblings(updatedProfile.siblings || []);
      setIsEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating patient profile:', err);
      setError('Failed to update profile. Please try again.');
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-profile">
      <div className="patient-profile-header">
        <div className="profile-header-content">
          <User size={32} className="profile-header-icon" />
          <div>
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">
              {isEditMode ? 'Edit your personal health information' : 'View your personal health information'}
            </p>
          </div>
        </div>
        {!isEditMode && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="secondary"
              icon={<Lock size={20} />}
              onClick={() => setIsChangePasswordOpen(true)}
            >
              Change Password
            </Button>
            <Button
              variant="primary"
              icon={<Edit size={20} />}
              onClick={handleEdit}
              disabled={loading}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      {loading && <div className="loading-message">Loading profile...</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Personal Information Section */}
        <Card variant="default">
          <div className="section-header">
            <Shield className="section-icon" />
            <h2 className="section-title">Personal Information</h2>
          </div>

          {isEditMode ? (
            // Edit Mode
            <>
              <div className="form-grid">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />

                <div className="input-wrapper">
                  <label className="input-label">
                    Patient ID
                    <span className="id-badge">Auto-generated</span>
                  </label>
                  <div className="patient-id-display">
                    <Shield size={18} className="id-icon" />
                    <span className="id-text">{formData.patientId}</span>
                  </div>
                  <p className="input-helper-text">This ID is permanent and cannot be changed</p>
                </div>
              </div>

              <div className="status-section">
                <label className="toggle-label">Patient Status</label>
                <div className="toggle-container">
                  <button
                    type="button"
                    className={`toggle-button ${formData.isAlive ? 'active' : ''}`}
                    onClick={() => handleToggle('isAlive')}
                  >
                    {formData.isAlive ? (
                      <>
                        <ToggleRight size={20} />
                        <span>Alive</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={20} />
                        <span>Deceased</span>
                      </>
                    )}
                  </button>
                </div>

                {!formData.isAlive && (
                  <div className="death-reason-input">
                    <Input
                      label="Death due to"
                      type="text"
                      name="deathReason"
                      value={formData.deathReason}
                      onChange={handleInputChange}
                      placeholder="Enter cause of death"
                      required
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            // View Mode
            <div className="profile-view-grid">
              <div className="profile-view-item">
                <label className="view-label">Full Name</label>
                <div className="view-value">
                  <User size={18} className="view-icon" />
                  <span>{formData.firstName} {formData.lastName}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Date of Birth</label>
                <div className="view-value">
                  <Calendar size={18} className="view-icon" />
                  <span>{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-IN', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  }) : 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Patient ID</label>
                <div className="patient-id-display">
                  <Shield size={18} className="id-icon" />
                  <span className="id-text">{formData.patientId}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Status</label>
                <div className="view-value">
                  <div className={`status-badge ${formData.isAlive ? 'status-alive' : 'status-deceased'}`}>
                    {formData.isAlive ? 'Alive' : 'Deceased'}
                  </div>
                </div>
              </div>

              {!formData.isAlive && formData.deathReason && (
                <div className="profile-view-item full-width">
                  <label className="view-label">Death Reason</label>
                  <div className="view-value">
                    <span>{formData.deathReason}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Medical Information Section */}
        <Card variant="default">
          <div className="section-header">
            <Heart className="section-icon" />
            <h2 className="section-title">Medical Information</h2>
          </div>

          {isEditMode ? (
            // Edit Mode
            <>
              <div className="form-grid">
                <div className="input-wrapper">
                  <label className="input-label">
                    Blood Group
                    <span className="input-required">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="select-field"
                    required
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <Input
                  label="Occupation"
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Your occupation"
                />

                <Input
                  label="Cell Number"
                  type="tel"
                  name="cellNo"
                  value={formData.cellNo}
                  onChange={handleInputChange}
                  placeholder="Your mobile number"
                />
              </div>

              <div className="subsection">
                <h3 className="subsection-title">Vital Signs</h3>
                <div className="form-grid">
                  <Input
                    label="Blood Pressure"
                    type="text"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleInputChange}
                    placeholder="e.g., 120/80"
                  />

                  <Input
                    label="Pulse Rate (bpm)"
                    type="number"
                    name="pulseRate"
                    value={formData.pulseRate}
                    onChange={handleInputChange}
                    placeholder="Beats per minute"
                  />
                </div>
              </div>

              <div className="form-grid">
                <Input
                  label="Height (cm)"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="Enter height in cm"
                  step="0.1"
                />

                <Input
                  label="Weight (kg)"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Enter weight in kg"
                  step="0.1"
                />
              </div>

              <div className="form-grid">
                <Input
                  label="Allergies"
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="List any allergies (comma separated)"
                />

                <Input
                  label="Chronic Diseases"
                  type="text"
                  name="chronicDiseases"
                  value={formData.chronicDiseases}
                  onChange={handleInputChange}
                  placeholder="List any chronic conditions"
                />
              </div>

              <Input
                label="Emergency Contact"
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Emergency contact name and number"
              />

              <div className="subsection">
                <h3 className="subsection-title">Insurance Information</h3>
                <div className="form-grid">
                  <Input
                    label="Insurance Provider"
                    type="text"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleInputChange}
                    placeholder="Insurance company name"
                  />

                  <Input
                    label="Insurance Number"
                    type="text"
                    name="insuranceNumber"
                    value={formData.insuranceNumber}
                    onChange={handleInputChange}
                    placeholder="Policy/member number"
                  />

                  <Input
                    label="Health Insurance No"
                    type="text"
                    name="healthInsuranceNo"
                    value={formData.healthInsuranceNo}
                    onChange={handleInputChange}
                    placeholder="Health insurance number"
                  />

                  <Input
                    label="Health Care Provider"
                    type="text"
                    name="healthCareProvider"
                    value={formData.healthCareProvider}
                    onChange={handleInputChange}
                    placeholder="Healthcare provider name"
                  />

                  <Input
                    label="Health Card No"
                    type="text"
                    name="healthCardNo"
                    value={formData.healthCardNo}
                    onChange={handleInputChange}
                    placeholder="Health card number"
                  />
                </div>
              </div>

              <div className="subsection">
                <h3 className="subsection-title">Birth Information</h3>
                <div className="form-grid">
                  <Input
                    label="Birth Place"
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    placeholder="City/Location of birth"
                    required
                  />

                  <Input
                    label="Hospital Name"
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    placeholder="Hospital where born"
                    required
                  />
                </div>
              </div>

              <Input
                label="Specific Instructions"
                type="text"
                name="specificInstructions"
                value={formData.specificInstructions}
                onChange={handleInputChange}
                placeholder="Any special medical instructions to follow"
              />
            </>
          ) : (
            // View Mode
            <>
              <div className="profile-view-grid">
                <div className="profile-view-item">
                  <label className="view-label">Blood Group</label>
                  <div className="view-value">
                    <Droplet size={18} className="view-icon blood-icon" />
                    <span className="blood-group-badge">{formData.bloodGroup || 'Not provided'}</span>
                  </div>
                </div>

                <div className="profile-view-item">
                  <label className="view-label">Occupation</label>
                  <div className="view-value">
                    <User size={18} className="view-icon" />
                    <span>{formData.occupation || 'Not provided'}</span>
                  </div>
                </div>

                <div className="profile-view-item">
                  <label className="view-label">Cell Number</label>
                  <div className="view-value">
                    <User size={18} className="view-icon" />
                    <span>{formData.cellNo || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="profile-view-grid">
                <div className="profile-view-item">
                  <label className="view-label">Blood Pressure</label>
                  <div className="view-value">
                    <Heart size={18} className="view-icon" />
                    <span>{formData.bloodPressure || 'Not measured'}</span>
                  </div>
                </div>

                <div className="profile-view-item">
                  <label className="view-label">Pulse Rate</label>
                  <div className="view-value">
                    <Heart size={18} className="view-icon" />
                    <span>{formData.pulseRate ? `${formData.pulseRate} bpm` : 'Not measured'}</span>
                  </div>
                </div>
              </div>

              <div className="profile-view-grid">
                <div className="profile-view-item">
                  <label className="view-label">Height</label>
                  <div className="view-value">
                    <User size={18} className="view-icon" />
                    <span>{formData.height ? `${formData.height} cm` : 'Not provided'}</span>
                  </div>
                </div>

                <div className="profile-view-item">
                  <label className="view-label">Weight</label>
                  <div className="view-value">
                    <User size={18} className="view-icon" />
                    <span>{formData.weight ? `${formData.weight} kg` : 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="profile-view-grid">
                <div className="profile-view-item">
                  <label className="view-label">Allergies</label>
                  <div className="view-value">
                    <Heart size={18} className="view-icon" />
                    <span>{formData.allergies || 'None reported'}</span>
                  </div>
                </div>

                <div className="profile-view-item">
                  <label className="view-label">Chronic Diseases</label>
                  <div className="view-value">
                    <Heart size={18} className="view-icon" />
                    <span>{formData.chronicDiseases || 'None reported'}</span>
                  </div>
                </div>
              </div>

              {formData.emergencyContact && (
                <div className="profile-view-item full-width">
                  <label className="view-label">Emergency Contact</label>
                  <div className="view-value">
                    <User size={18} className="view-icon" />
                    <span>{formData.emergencyContact}</span>
                  </div>
                </div>
              )}

              <div className="subsection">
                <h3 className="subsection-title">Insurance Information</h3>
                <div className="profile-view-grid">
                  <div className="profile-view-item">
                    <label className="view-label">Insurance Provider</label>
                    <div className="view-value">
                      <Shield size={18} className="view-icon" />
                      <span>{formData.insuranceProvider || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="profile-view-item">
                    <label className="view-label">Insurance Number</label>
                    <div className="view-value">
                      <Shield size={18} className="view-icon" />
                      <span>{formData.insuranceNumber || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="profile-view-item">
                    <label className="view-label">Health Insurance No</label>
                    <div className="view-value">
                      <Shield size={18} className="view-icon" />
                      <span>{formData.healthInsuranceNo || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="profile-view-item">
                    <label className="view-label">Health Care Provider</label>
                    <div className="view-value">
                      <Shield size={18} className="view-icon" />
                      <span>{formData.healthCareProvider || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="profile-view-item">
                    <label className="view-label">Health Card No</label>
                    <div className="view-value">
                      <Shield size={18} className="view-icon" />
                      <span>{formData.healthCardNo || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h3 className="subsection-title">Birth Information</h3>
                <div className="profile-view-grid">
                  <div className="profile-view-item">
                    <label className="view-label">Birth Place</label>
                    <div className="view-value">
                      <MapPin size={18} className="view-icon" />
                      <span>{formData.birthPlace || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="profile-view-item">
                    <label className="view-label">Hospital Name</label>
                    <div className="view-value">
                      <Building2 size={18} className="view-icon" />
                      <span>{formData.hospitalName || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {formData.specificInstructions && (
                <div className="subsection">
                  <div className="profile-view-item full-width">
                    <label className="view-label">Specific Instructions</label>
                    <div className="view-value instructions-box">
                      <FileText size={18} className="view-icon" />
                      <span>{formData.specificInstructions}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Family Information Section */}
        <Card variant="default">
          <div className="section-header">
            <Users className="section-icon" />
            <h2 className="section-title">Family Information</h2>
          </div>

          {isEditMode ? (
            // Edit Mode
            <>
              <div className="toggle-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.hasNoParentInfo}
                    onChange={() => handleToggle('hasNoParentInfo')}
                    disabled={!isEditMode}
                  />
                  <span>No parent information available</span>
                </label>
              </div>

              {!formData.hasNoParentInfo && (
                <>
                  <div className="subsection">
                    <h3 className="subsection-title">Parents Information</h3>
                    <div className="form-grid">
                      <Input
                        label="Mother's Unique Health ID"
                        type="text"
                        name="motherHealthId"
                        value={formData.motherHealthId}
                        onChange={handleInputChange}
                        placeholder="Enter mother's health ID"
                      />

                      <Input
                        label="Father's Unique Health ID"
                        type="text"
                        name="fatherHealthId"
                        value={formData.fatherHealthId}
                        onChange={handleInputChange}
                        placeholder="Enter father's health ID"
                      />
                    </div>

                    <Input
                      label="Parents' Allergies"
                      type="text"
                      name="parentsAllergies"
                      value={formData.parentsAllergies}
                      onChange={handleInputChange}
                      placeholder="List any known parental allergies"
                    />
                  </div>
                </>
              )}

              <div className="subsection">
                <div className="subsection-header">
                  <h3 className="subsection-title">Siblings Information (Optional)</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    icon={<Plus size={16} />}
                    onClick={addSibling}
                  >
                    Add Sibling
                  </Button>
                </div>

                <div className="siblings-list">
                  {siblings.map((sibling, index) => (
                    <div key={index} className="sibling-input-group">
                      <div className="sibling-input-wrapper">
                        <Input
                          label={`Sibling ${index + 1} Health ID`}
                          type="text"
                          value={sibling}
                          onChange={(e) => handleSiblingChange(index, e.target.value)}
                          placeholder="Enter sibling's health ID"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        icon={<Trash2 size={16} />}
                        onClick={() => removeSibling(index)}
                        className="remove-sibling-btn"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // View Mode
            <>
              {formData.hasNoParentInfo ? (
                <div className="no-data-message">
                  <p>No parent information available</p>
                </div>
              ) : (
                <div className="subsection">
                  <h3 className="subsection-title">Parents Information</h3>
                  <div className="profile-view-grid">
                    <div className="profile-view-item">
                      <label className="view-label">Mother's Health ID</label>
                      <div className="view-value">
                        <Shield size={18} className="view-icon" />
                        <span>{formData.motherHealthId || 'Not provided'}</span>
                      </div>
                    </div>

                    <div className="profile-view-item">
                      <label className="view-label">Father's Health ID</label>
                      <div className="view-value">
                        <Shield size={18} className="view-icon" />
                        <span>{formData.fatherHealthId || 'Not provided'}</span>
                      </div>
                    </div>

                    <div className="profile-view-item full-width">
                      <label className="view-label">Parents' Allergies</label>
                      <div className="view-value">
                        <Heart size={18} className="view-icon" />
                        <span>{formData.parentsAllergies || 'None reported'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="subsection">
                <h3 className="subsection-title">Siblings Information</h3>
                {siblings.filter(s => s.trim() !== '').length > 0 ? (
                  <div className="siblings-view-list">
                    {siblings.filter(s => s.trim() !== '').map((sibling, index) => (
                      <div key={index} className="profile-view-item">
                        <label className="view-label">Sibling {index + 1} Health ID</label>
                        <div className="view-value">
                          <Shield size={18} className="view-icon" />
                          <span>{sibling}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No sibling information provided</p>
                  </div>
                )}
              </div>
            </>
          )}
        </Card>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              icon={<XIcon size={20} />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={20} />}
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}

export default PatientProfile;
