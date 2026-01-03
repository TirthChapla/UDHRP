import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Trash2, Lock, Shield, AlertTriangle } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './ReceptionistProfile.css';

function ReceptionistProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteVerification, setDeleteVerification] = useState({
    doctorEmail: '',
    doctorPassword: ''
  });

  // Mock data - replace with actual user data from context/API
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.receptionist@example.com',
    phone: '+1 (555) 123-4567',
    doctorName: 'Dr. Michael Smith',
    doctorEmail: 'dr.smith@example.com',
    joinedDate: '2025-12-01'
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleSave = () => {
    // Mock save - replace with API call
    setProfileData({ ...editData });
    setIsEditing(false);
    alert('Profile updated successfully!');
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
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-header-info">
            <h1>{profileData.name}</h1>
            <p className="profile-role">Receptionist</p>
            <p className="profile-joined">
              Joined {new Date(profileData.joinedDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="profile-grid">
          {/* Personal Information */}
          <Card variant="default" className="profile-section">
            <div className="section-header">
              <User size={24} />
              <h2>Personal Information</h2>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <p>{profileData.name}</p>
                )}
              </div>

              <div className="info-item">
                <label>
                  <Mail size={16} />
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>

              <div className="info-item">
                <label>
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>
            </div>

            <div className="section-actions">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit}>
                  Edit Profile
                </Button>
              )}
            </div>
          </Card>

          {/* Doctor Information */}
          <Card variant="default" className="profile-section">
            <div className="section-header">
              <Shield size={24} />
              <h2>Associated Doctor</h2>
            </div>

            <div className="doctor-info">
              <div className="info-item">
                <label>Doctor Name</label>
                <p>{profileData.doctorName}</p>
              </div>

              <div className="info-item">
                <label>
                  <Mail size={16} />
                  Doctor Email
                </label>
                <p>{profileData.doctorEmail}</p>
              </div>
            </div>

            <div className="info-note">
              <AlertTriangle size={16} />
              <span>You are authorized by this doctor to manage appointments</span>
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
                variant="outline"
                className="delete-button"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={20} />
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
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
    </div>
  );
}

export default ReceptionistProfile;
