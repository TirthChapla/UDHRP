import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Trash2, Lock, Shield, AlertTriangle, Calendar, MapPin, Briefcase } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import { getReceptionistProfile, updateReceptionistProfile } from '../../services/receptionistService';
import './ReceptionistProfile.css';

function ReceptionistProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteVerification, setDeleteVerification] = useState({
    doctorEmail: '',
    doctorPassword: ''
  });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    receptionistId: '',
    department: '',
    employeeId: '',
    shift: '',
    notes: '',
    doctorName: '',
    doctorEmail: ''
  });

  const [editData, setEditData] = useState({ ...profileData });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReceptionistProfile();
      
      console.log('Fetched receptionist profile:', data);
      
      const mappedData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        receptionistId: data.receptionistId || '',
        department: data.department || '',
        employeeId: data.employeeId || '',
        shift: data.shift || '',
        notes: data.notes || '',
        doctorName: data.doctorName || '',
        doctorEmail: data.doctorEmail || ''
      };
      
      setProfileData(mappedData);
      setEditData(mappedData);
    } catch (err) {
      console.error('Error fetching receptionist profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e) => {
    if (e) e.preventDefault();
    console.log('Edit button clicked, entering edit mode');
    setEditData({ ...profileData });
    setIsEditing(true);
    console.log('isEditing set to true');
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const updateRequest = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        phoneNumber: editData.phoneNumber,
        dateOfBirth: editData.dateOfBirth,
        gender: editData.gender,
        address: editData.address,
        city: editData.city,
        state: editData.state,
        zipCode: editData.zipCode,
        department: editData.department,
        employeeId: editData.employeeId,
        shift: editData.shift,
        notes: editData.notes,
        doctorName: editData.doctorName,
        doctorEmail: editData.doctorEmail
      };
      
      console.log('Sending update request:', updateRequest);
      
      const updatedProfile = await updateReceptionistProfile(updateRequest);
      
      console.log('Received updated profile:', updatedProfile);
      
      if (updatedProfile) {
        const mappedData = {
          firstName: updatedProfile.firstName || '',
          lastName: updatedProfile.lastName || '',
          email: updatedProfile.email || profileData.email || '',
          phoneNumber: updatedProfile.phoneNumber || '',
          dateOfBirth: updatedProfile.dateOfBirth || '',
          gender: updatedProfile.gender || '',
          address: updatedProfile.address || '',
          city: updatedProfile.city || '',
          state: updatedProfile.state || '',
          zipCode: updatedProfile.zipCode || '',
          receptionistId: updatedProfile.receptionistId || profileData.receptionistId || '',
          department: updatedProfile.department || '',
          employeeId: updatedProfile.employeeId || '',
          shift: updatedProfile.shift || '',
          notes: updatedProfile.notes || '',
          doctorName: updatedProfile.doctorName || '',
          doctorEmail: updatedProfile.doctorEmail || ''
        };
        
        setProfileData(mappedData);
        setEditData(mappedData);
      }
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      alert('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();

    // Validate doctor credentials
    if (!deleteVerification.doctorEmail || !deleteVerification.doctorPassword) {
      alert('Please provide doctor credentials to delete account');
      return;
    }

    // Mock verification - replace with actual API call
    if (deleteVerification.doctorEmail === profileData.doctorEmail) {
      console.log('Deleting account with verification:', deleteVerification);
      alert('Account deleted successfully');
      navigate('/login');
    } else {
      alert('Invalid doctor credentials');
    }
  };

  return (
    <div className="receptionist-profile">
      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-header-info">
            <h1>{profileData.firstName} {profileData.lastName}</h1>
            <p className="profile-role">Receptionist</p>
            {profileData.receptionistId && (
              <p className="profile-id">ID: {profileData.receptionistId}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-grid">
          {/* Personal Information */}
          <Card variant="default" className="profile-section">
            <div className="section-header">
              <User size={24} />
              <h2>Personal Information</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>First Name</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    required
                  />
                ) : (
                  <p>{profileData.firstName || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Last Name</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    required
                  />
                ) : (
                  <p>{profileData.lastName || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>
                  <Mail size={16} />
                  Email Address
                </label>
                <p>{profileData.email}</p>
              </div>

              <div className="info-item">
                <label>
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editData.phoneNumber}
                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                  />
                ) : (
                  <p>{profileData.phoneNumber || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>
                  <Calendar size={16} />
                  Date of Birth
                </label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.dateOfBirth}
                    onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                  />
                ) : (
                  <p>{profileData.dateOfBirth || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Gender</label>
                {isEditing ? (
                  <select
                    value={editData.gender}
                    onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <p>{profileData.gender || 'Not provided'}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card variant="default" className="profile-section">
            <div className="section-header">
              <MapPin size={24} />
              <h2>Address Information</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Address</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  />
                ) : (
                  <p>{profileData.address || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>City</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.city}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  />
                ) : (
                  <p>{profileData.city || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>State</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.state}
                    onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                  />
                ) : (
                  <p>{profileData.state || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Zip Code</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.zipCode}
                    onChange={(e) => setEditData({ ...editData, zipCode: e.target.value })}
                  />
                ) : (
                  <p>{profileData.zipCode || 'Not provided'}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Work Information */}
          <Card variant="default" className="profile-section">
            <div className="section-header">
              <Briefcase size={24} />
              <h2>Work Information</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Department</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.department}
                    onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  />
                ) : (
                  <p>{profileData.department || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Employee ID</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.employeeId}
                    onChange={(e) => setEditData({ ...editData, employeeId: e.target.value })}
                  />
                ) : (
                  <p>{profileData.employeeId || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Shift</label>
                {isEditing ? (
                  <select
                    value={editData.shift}
                    onChange={(e) => setEditData({ ...editData, shift: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                ) : (
                  <p>{profileData.shift || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item full-width">
                <label>Notes</label>
                {isEditing ? (
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Additional notes..."
                  />
                ) : (
                  <p>{profileData.notes || 'No notes'}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Doctor Information */}
          <Card variant="default" className="profile-section">
            <div className="section-header">
              <Shield size={24} />
              <h2>Associated Doctor</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Doctor Name</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.doctorName}
                    onChange={(e) => setEditData({ ...editData, doctorName: e.target.value })}
                  />
                ) : (
                  <p>{profileData.doctorName || 'Not assigned'}</p>
                )}
              </div>

              <div className="info-item">
                <label>
                  <Mail size={16} />
                  Doctor Email
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.doctorEmail}
                    onChange={(e) => setEditData({ ...editData, doctorEmail: e.target.value })}
                  />
                ) : (
                  <p>{profileData.doctorEmail || 'Not assigned'}</p>
                )}
              </div>
            </div>

            <div className="info-note">
              <AlertTriangle size={16} />
              <span>You are authorized by this doctor to manage appointments</span>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card variant="default" className="profile-section action-section">
            <div className="section-actions">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" type="button" onClick={() => setIsChangePasswordOpen(true)}>
                    <Lock size={18} />
                    Change Password
                  </Button>
                  <Button type="button" onClick={(e) => handleEdit(e)}>
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Danger Zone */}
          <Card variant="default" className="profile-section danger-section">
            <div className="section-header">
              <Trash2 size={24} />
              <h2>Danger Zone</h2>
            </div>

            <div className="danger-content">
              <div className="danger-warning">
                <AlertTriangle size={20} />
                <div>
                  <h3>Delete Account</h3>
                  <p>Once you delete your account, there is no going back. This action requires doctor verification.</p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="delete-button"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={20} />
                Delete Account
              </Button>
            </div>
          </Card>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <AlertTriangle size={24} className="warning-icon" />
                Delete Account
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleDeleteAccount}>
              <div className="modal-body">
                <div className="delete-warning">
                  <p>This action cannot be undone. This will permanently delete the receptionist account.</p>
                </div>

                <div className="verification-section">
                  <div className="verification-header">
                    <Lock size={20} />
                    <h3>Doctor Verification Required</h3>
                  </div>
                  <p className="verification-description">
                    The doctor must provide their credentials to authorize this deletion.
                  </p>

                  <Input
                    label="Doctor Email"
                    type="email"
                    placeholder="doctor@example.com"
                    value={deleteVerification.doctorEmail}
                    onChange={(e) => setDeleteVerification({
                      ...deleteVerification,
                      doctorEmail: e.target.value
                    })}
                    required
                    icon={<Mail size={20} />}
                  />

                  <Input
                    label="Doctor Password"
                    type="password"
                    placeholder="Enter doctor's password"
                    value={deleteVerification.doctorPassword}
                    onChange={(e) => setDeleteVerification({
                      ...deleteVerification,
                      doctorPassword: e.target.value
                    })}
                    required
                    icon={<Lock size={20} />}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="delete-confirm-button">
                  <Trash2 size={20} />
                  Delete Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}

export default ReceptionistProfile;
