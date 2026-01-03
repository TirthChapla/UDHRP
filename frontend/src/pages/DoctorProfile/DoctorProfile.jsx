import React, { useState } from 'react';
import { 
  User, 
  GraduationCap,
  Award,
  Briefcase,
  MapPin, 
  Building2,
  Calendar,
  Edit,
  Save,
  X as XIcon,
  Stethoscope,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import './DoctorProfile.css';

function DoctorProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  // Mock data - In real app, this would come from API/database
  const [formData, setFormData] = useState({
    name: 'Dr. Sarah Patel',
    degree: 'MBBS, MD (Internal Medicine)',
    college: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    speciality: 'Cardiology',
    currentHospital: 'Apollo Hospital',
    currentHospitalAddress: 'Sector 26, Noida, Uttar Pradesh - 201301',
    registrationNumber: 'MCI-' + Math.random().toString(36).substr(2, 9).toUpperCase(), // Auto-generated
    consultationFee: '1500',
    yearsOfExperience: '12'
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      organization: 'Max Super Speciality Hospital',
      position: 'Senior Cardiologist',
      type: 'hospital',
      startMonth: '06',
      startYear: '2018',
      endMonth: '12',
      endYear: '2022',
      isCurrent: false
    },
    {
      id: 2,
      organization: 'Fortis Healthcare',
      position: 'Consultant Cardiologist',
      type: 'hospital',
      startMonth: '01',
      startYear: '2015',
      endMonth: '05',
      endYear: '2018',
      isCurrent: false
    }
  ]);
  
  // Keep original data for cancel functionality
  const [originalData, setOriginalData] = useState({ ...formData });
  const [originalExperiences, setOriginalExperiences] = useState([...experiences]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setExperiences(prev => 
      prev.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      organization: '',
      position: '',
      type: 'hospital',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      isCurrent: false
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setOriginalExperiences([...experiences]);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setExperiences([...originalExperiences]);
    setIsEditMode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      ...formData,
      experiences: experiences.filter(exp => exp.organization.trim() !== '')
    };
    console.log('Doctor Profile Data:', profileData);
    // Here you would typically send this to your backend
    setIsEditMode(false);
    alert('Profile updated successfully!');
  };

  const formatMonthYear = (month, year) => {
    if (!month || !year) return 'Not specified';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="doctor-profile">
      <div className="doctor-profile-header">
        <div className="profile-header-content">
          <Stethoscope size={32} className="profile-header-icon" />
          <div>
            <h1 className="profile-title">Doctor Profile</h1>
            <p className="profile-subtitle">
              {isEditMode ? 'Edit your professional information' : 'View your professional information'}
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
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Personal & Professional Information */}
        <Card variant="default">
          <div className="section-header">
            <User className="section-icon" />
            <h2 className="section-title">Personal & Professional Information</h2>
          </div>

          {isEditMode ? (
            <>
              <div className="form-grid">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name with title"
                  required
                />

                <div className="input-wrapper">
                  <label className="input-label">
                    Registration Number
                    <span className="id-badge">Auto-generated</span>
                  </label>
                  <div className="registration-id-display">
                    <Award size={18} className="id-icon" />
                    <span className="id-text">{formData.registrationNumber}</span>
                  </div>
                  <p className="input-helper-text">Medical registration number (permanent)</p>
                </div>

                <Input
                  label="Degree/Qualification"
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., MBBS, MD, MS"
                  required
                />

                <Input
                  label="Speciality"
                  type="text"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  placeholder="e.g., Cardiology, Neurology"
                  required
                />

                <Input
                  label="Years of Experience"
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  placeholder="Total years of practice"
                  required
                />

                <Input
                  label="Consultation Fee (₹)"
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  placeholder="Per consultation fee"
                  required
                />
              </div>

              <div className="form-grid" style={{ marginTop: 'var(--spacing-lg)' }}>
                <div className="input-wrapper full-width">
                  <Input
                    label="Medical College/University"
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="Name of medical college"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="profile-view-grid">
              <div className="profile-view-item">
                <label className="view-label">Full Name</label>
                <div className="view-value">
                  <User size={18} className="view-icon" />
                  <span>{formData.name}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Registration Number</label>
                <div className="registration-id-display">
                  <Award size={18} className="id-icon" />
                  <span className="id-text">{formData.registrationNumber}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Degree/Qualification</label>
                <div className="view-value">
                  <GraduationCap size={18} className="view-icon" />
                  <span>{formData.degree}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Speciality</label>
                <div className="view-value">
                  <Award size={18} className="view-icon" />
                  <span>{formData.speciality}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Experience</label>
                <div className="view-value">
                  <Briefcase size={18} className="view-icon" />
                  <span>{formData.yearsOfExperience} years</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Consultation Fee</label>
                <div className="view-value">
                  <span className="fee-badge">₹{formData.consultationFee}</span>
                </div>
              </div>

              <div className="profile-view-item full-width">
                <label className="view-label">Medical College/University</label>
                <div className="view-value">
                  <GraduationCap size={18} className="view-icon" />
                  <span>{formData.college}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Current Practice Information */}
        <Card variant="default">
          <div className="section-header">
            <Building2 className="section-icon" />
            <h2 className="section-title">Current Practice</h2>
          </div>

          {isEditMode ? (
            <div className="form-grid">
              <Input
                label="Hospital/Clinic Name"
                type="text"
                name="currentHospital"
                value={formData.currentHospital}
                onChange={handleInputChange}
                placeholder="Current workplace"
                required
              />

              <div className="input-wrapper full-width">
                <Input
                  label="Hospital/Clinic Address"
                  type="text"
                  name="currentHospitalAddress"
                  value={formData.currentHospitalAddress}
                  onChange={handleInputChange}
                  placeholder="Complete address"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="profile-view-grid">
              <div className="profile-view-item">
                <label className="view-label">Hospital/Clinic</label>
                <div className="view-value">
                  <Building2 size={18} className="view-icon" />
                  <span>{formData.currentHospital}</span>
                </div>
              </div>

              <div className="profile-view-item full-width">
                <label className="view-label">Address</label>
                <div className="view-value">
                  <MapPin size={18} className="view-icon" />
                  <span>{formData.currentHospitalAddress}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Experience History */}
        <Card variant="default">
          <div className="section-header">
            <Briefcase className="section-icon" />
            <h2 className="section-title">Experience History</h2>
          </div>

          {isEditMode ? (
            <>
              {experiences.map((exp, index) => (
                <div key={exp.id} className="experience-card">
                  <div className="experience-header">
                    <h3 className="experience-number">Experience {index + 1}</h3>
                    {experiences.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        icon={<Trash2 size={16} />}
                        onClick={() => removeExperience(exp.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="form-grid">
                    <Input
                      label="Organization/Hospital"
                      type="text"
                      value={exp.organization}
                      onChange={(e) => handleExperienceChange(exp.id, 'organization', e.target.value)}
                      placeholder="Hospital or clinic name"
                      required
                    />

                    <Input
                      label="Position/Role"
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                      placeholder="Your designation"
                      required
                    />

                    <div className="input-wrapper">
                      <label className="input-label">
                        Practice Type
                        <span className="input-required">*</span>
                      </label>
                      <select
                        value={exp.type}
                        onChange={(e) => handleExperienceChange(exp.id, 'type', e.target.value)}
                        className="select-field"
                        required
                      >
                        <option value="hospital">Hospital</option>
                        <option value="clinic">Private Clinic</option>
                        <option value="personal">Personal Practice</option>
                      </select>
                    </div>

                    <div className="input-wrapper">
                      <label className="input-label">Start Date</label>
                      <div className="date-input-group">
                        <select
                          value={exp.startMonth}
                          onChange={(e) => handleExperienceChange(exp.id, 'startMonth', e.target.value)}
                          className="select-field select-month"
                          required
                        >
                          <option value="">Month</option>
                          {months.map(month => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={exp.startYear}
                          onChange={(e) => handleExperienceChange(exp.id, 'startYear', e.target.value)}
                          className="select-field select-year"
                          required
                        >
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="input-wrapper">
                      <label className="input-label">End Date</label>
                      <div className="date-input-group">
                        <select
                          value={exp.endMonth}
                          onChange={(e) => handleExperienceChange(exp.id, 'endMonth', e.target.value)}
                          className="select-field select-month"
                          disabled={exp.isCurrent}
                        >
                          <option value="">Month</option>
                          {months.map(month => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={exp.endYear}
                          onChange={(e) => handleExperienceChange(exp.id, 'endYear', e.target.value)}
                          className="select-field select-year"
                          disabled={exp.isCurrent}
                        >
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className="checkbox-label" style={{ marginTop: 'var(--spacing-sm)' }}>
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) => handleExperienceChange(exp.id, 'isCurrent', e.target.checked)}
                        />
                        <span>Currently working here</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                icon={<Plus size={20} />}
                onClick={addExperience}
                style={{ marginTop: 'var(--spacing-lg)' }}
              >
                Add Experience
              </Button>
            </>
          ) : (
            <div className="experience-timeline">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker">
                    <Briefcase size={16} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3 className="timeline-title">{exp.position}</h3>
                      <span className="timeline-type-badge">{exp.type}</span>
                    </div>
                    <p className="timeline-organization">{exp.organization}</p>
                    <div className="timeline-date">
                      <Calendar size={14} />
                      <span>
                        {formatMonthYear(exp.startMonth, exp.startYear)} - {' '}
                        {exp.isCurrent ? 'Present' : formatMonthYear(exp.endMonth, exp.endYear)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Form Actions */}
        {isEditMode && (
          <Card variant="default">
            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                icon={<XIcon size={20} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={<Save size={20} />}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        )}
      </form>

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}

export default DoctorProfile;
