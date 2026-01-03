import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X as XIcon } from 'lucide-react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import authService from '../../services/authService';
import './ChangePasswordModal.css';

function ChangePasswordModal({ isOpen, onClose }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      const result = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (result.success) {
        setSuccessMessage('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 2000);
      } else {
        setApiError(result.message || 'Failed to change password. Please check your current password.');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setApiError('');
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-modal-overlay" onClick={handleClose}>
      <div className="change-password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <Lock size={24} />
            <h2>Change Password</h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {apiError && (
            <div className="error-message">
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <div className="password-input-wrapper">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="password-input-wrapper">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              placeholder="Enter new password (min. 6 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="password-input-wrapper">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
