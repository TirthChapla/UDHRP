import React, { useState, useEffect } from 'react';
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
import { getDoctorProfile, updateDoctorProfile } from '../../services/doctorService';
import './DoctorProfile.css';

function DoctorProfile() {
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
    licenseNumber: '',
    specialization: '',
    qualification: '',
    experienceYears: '',
    about: '',
    hospital: '',
    department: '',
    consultationFee: '',
    languages: [],
    isAvailable: true
  });
  
  // Keep original data for cancel functionality
  const [originalData, setOriginalData] = useState({ ...formData });

  // Fetch doctor profile on component mount
  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDoctorProfile();
      
      console.log('Fetched doctor profile data:', data);
      
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
        licenseNumber: data.licenseNumber || '',
        specialization: data.specialization || '',
        qualification: data.qualification || '',
        experienceYears: data.experienceYears || '',
        about: data.about || '',
        hospital: data.hospital || '',
        department: data.department || '',
        consultationFee: data.consultationFee || '',
        languages: data.languages || [],
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true
      };
      
      setFormData(mappedData);
      setOriginalData(mappedData);
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setError('Failed to load doctor profile. Please try again.');
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

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const profileData = { ...formData };
      
      const updatedProfile = await updateDoctorProfile(profileData);
      
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
        licenseNumber: updatedProfile.licenseNumber || '',
        specialization: updatedProfile.specialization || '',
        qualification: updatedProfile.qualification || '',
        experienceYears: updatedProfile.experienceYears || '',
        about: updatedProfile.about || '',
        hospital: updatedProfile.hospital || '',
        department: updatedProfile.department || '',
        consultationFee: updatedProfile.consultationFee || '',
        languages: updatedProfile.languages || [],
        isAvailable: updatedProfile.isAvailable !== undefined ? updatedProfile.isAvailable : true
      };
      
      setFormData(mappedData);
      setOriginalData(mappedData);
      setIsEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      setError('Failed to update profile. Please try again.');
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
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
                  <label className="input-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <Input
                  label="License Number"
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Medical license number"
                  required
                />

                <Input
                  label="Specialization"
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Cardiology, Neurology"
                  required
                />

                <Input
                  label="Qualification"
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., MBBS, MD, MS"
                  required
                />

                <Input
                  label="Years of Experience"
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  placeholder="Total years of practice"
                />

                <Input
                  label="Consultation Fee (₹)"
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  placeholder="Per consultation fee"
                />

                <div className="input-wrapper">
                  <label className="input-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      style={{ marginRight: '8px' }}
                    />
                    Available for Appointments
                  </label>
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: 'var(--spacing-lg)' }}>
                <div className="input-wrapper full-width">
                  <label className="input-label">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Brief description about yourself"
                    className="input-field"
                    rows="4"
                    style={{ width: '100%', resize: 'vertical' }}
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
                  <span>{formData.firstName} {formData.lastName}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Phone Number</label>
                <div className="view-value">
                  <span>{formData.phoneNumber || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Date of Birth</label>
                <div className="view-value">
                  <Calendar size={18} className="view-icon" />
                  <span>{formData.dateOfBirth || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Gender</label>
                <div className="view-value">
                  <span>{formData.gender || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">License Number</label>
                <div className="view-value">
                  <Award size={18} className="view-icon" />
                  <span>{formData.licenseNumber || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Specialization</label>
                <div className="view-value">
                  <Stethoscope size={18} className="view-icon" />
                  <span>{formData.specialization || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Qualification</label>
                <div className="view-value">
                  <GraduationCap size={18} className="view-icon" />
                  <span>{formData.qualification || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Experience</label>
                <div className="view-value">
                  <Briefcase size={18} className="view-icon" />
                  <span>{formData.experienceYears ? `${formData.experienceYears} years` : 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Consultation Fee</label>
                <div className="view-value">
                  <span className="fee-badge">{formData.consultationFee ? `₹${formData.consultationFee}` : 'Not set'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Availability Status</label>
                <div className="view-value">
                  <span className={formData.isAvailable ? 'status-badge-active' : 'status-badge-inactive'}>
                    {formData.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {formData.about && (
                <div className="profile-view-item full-width">
                  <label className="view-label">About</label>
                  <div className="view-value">
                    <span>{formData.about}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Address Information */}
        <Card variant="default">
          <div className="section-header">
            <MapPin className="section-icon" />
            <h2 className="section-title">Address Information</h2>
          </div>

          {isEditMode ? (
            <div className="form-grid">
              <Input
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
              />

              <Input
                label="City"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
              />

              <Input
                label="State"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
              />

              <Input
                label="Zip Code"
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Zip code"
              />
            </div>
          ) : (
            <div className="profile-view-grid">
              <div className="profile-view-item">
                <label className="view-label">Address</label>
                <div className="view-value">
                  <MapPin size={18} className="view-icon" />
                  <span>{formData.address || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">City</label>
                <div className="view-value">
                  <span>{formData.city || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">State</label>
                <div className="view-value">
                  <span>{formData.state || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Zip Code</label>
                <div className="view-value">
                  <span>{formData.zipCode || 'Not provided'}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Hospital & Department Information */}
        <Card variant="default">
          <div className="section-header">
            <Building2 className="section-icon" />
            <h2 className="section-title">Hospital & Department</h2>
          </div>

          {isEditMode ? (
            <div className="form-grid">
              <Input
                label="Hospital"
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleInputChange}
                placeholder="Hospital name"
              />

              <Input
                label="Department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department"
              />

              <div className="input-wrapper full-width">
                <label className="input-label">Languages (comma-separated)</label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    languages: e.target.value.split(',').map(lang => lang.trim()).filter(Boolean)
                  }))}
                  placeholder="e.g., English, Hindi, Spanish"
                  className="input-field"
                />
              </div>
            </div>
          ) : (
            <div className="profile-view-grid">
              <div className="profile-view-item">
                <label className="view-label">Hospital</label>
                <div className="view-value">
                  <Building2 size={18} className="view-icon" />
                  <span>{formData.hospital || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-view-item">
                <label className="view-label">Department</label>
                <div className="view-value">
                  <span>{formData.department || 'Not provided'}</span>
                </div>
              </div>

              {formData.languages && formData.languages.length > 0 && (
                <div className="profile-view-item full-width">
                  <label className="view-label">Languages</label>
                  <div className="view-value">
                    <span>{formData.languages.join(', ')}</span>
                  </div>
                </div>
              )}
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
