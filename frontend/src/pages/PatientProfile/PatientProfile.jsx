import React, { useState } from 'react';
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
  X as XIcon
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './PatientProfile.css';

function PatientProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Mock data - In real app, this would come from API/database
  const [formData, setFormData] = useState({
    name: 'John Doe',
    dob: '1990-05-15',
    patientId: 'PAT-' + Math.random().toString(36).substr(2, 9).toUpperCase(), // Auto-generated
    isAlive: true,
    deathReason: '',
    motherHealthId: 'PAT-MOM123456',
    fatherHealthId: 'PAT-DAD789012',
    parentsAllergies: 'Penicillin, Pollen',
    hasNoParentInfo: false,
    bloodGroup: 'O+',
    birthPlace: 'Mumbai, Maharashtra',
    hospitalName: 'Apollo Hospital',
    specificInstructions: 'Allergic to sulfa drugs, Regular blood pressure monitoring required'
  });

  const [siblings, setSiblings] = useState(['PAT-SIB123456', 'PAT-SIB789012']); // Default 2 siblings
  
  // Keep original data for cancel functionality
  const [originalData, setOriginalData] = useState({ ...formData });
  const [originalSiblings, setOriginalSiblings] = useState([...siblings]);

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
    if (siblings.length > 1) {
      const newSiblings = siblings.filter((_, i) => i !== index);
      setSiblings(newSiblings);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      ...formData,
      siblings: siblings.filter(id => id.trim() !== '')
    };
    console.log('Profile Data:', profileData);
    // Here you would typically send this to your backend
    setIsEditMode(false);
    alert('Profile updated successfully!');
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
          <Button
            variant="primary"
            icon={<Edit size={20} />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </div>

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
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={formData.dob}
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
                  <span>{formData.name}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Date of Birth</label>
                <div className="view-value">
                  <Calendar size={18} className="view-icon" />
                  <span>{new Date(formData.dob).toLocaleDateString('en-IN', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}</span>
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
                      {siblings.length > 1 && (
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
                      )}
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
    </div>
  );
}

export default PatientProfile;
