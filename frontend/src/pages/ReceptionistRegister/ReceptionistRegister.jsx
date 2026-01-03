import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './ReceptionistRegister.css';

function ReceptionistRegister() {
  const navigate = useNavigate();
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);
  const [showReceptionistPassword, setShowReceptionistPassword] = useState(false);
  const [formData, setFormData] = useState({
    doctorEmail: '',
    doctorPassword: '',
    receptionistName: '',
    receptionistEmail: '',
    receptionistPassword: '',
    receptionistPhone: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    
    if (!formData.doctorEmail) {
      newErrors.doctorEmail = 'Doctor email is required';
    }
    
    if (!formData.doctorPassword) {
      newErrors.doctorPassword = 'Doctor password is required';
    }
    
    if (!formData.receptionistName) {
      newErrors.receptionistName = 'Receptionist name is required';
    }
    
    if (!formData.receptionistEmail) {
      newErrors.receptionistEmail = 'Receptionist email is required';
    }
    
    if (!formData.receptionistPassword || formData.receptionistPassword.length < 6) {
      newErrors.receptionistPassword = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock registration - replace with API call
    console.log('Registering receptionist:', formData);
    alert('Receptionist account created successfully!');
    navigate('/receptionist/login');
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="receptionist-register">
      <div className="register-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        <Card variant="default" className="register-card">
          <div className="register-header">
            <div className="header-icon">
              <UserPlus size={32} />
            </div>
            <h1>Register Receptionist</h1>
            <p>Create a new receptionist account with doctor verification</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Doctor Verification Section */}
            <div className="form-section">
              <div className="section-title">
                <Shield size={20} />
                <h2>Doctor Verification</h2>
              </div>
              <p className="section-description">
                Doctor must provide their credentials to create a receptionist account
              </p>

              <Input
                label="Doctor Email"
                type="email"
                placeholder="doctor@example.com"
                value={formData.doctorEmail}
                onChange={(e) => handleChange('doctorEmail', e.target.value)}
                error={errors.doctorEmail}
                required
                icon={<Mail size={20} />}
              />

              <div className="password-input-wrapper">
                <Input
                  label="Doctor Password"
                  type={showDoctorPassword ? 'text' : 'password'}
                  placeholder="Enter doctor's password"
                  value={formData.doctorPassword}
                  onChange={(e) => handleChange('doctorPassword', e.target.value)}
                  error={errors.doctorPassword}
                  required
                  icon={<Lock size={20} />}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowDoctorPassword(!showDoctorPassword)}
                >
                  {showDoctorPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="divider"></div>

            {/* Receptionist Details Section */}
            <div className="form-section">
              <div className="section-title">
                <UserPlus size={20} />
                <h2>Receptionist Details</h2>
              </div>
              <p className="section-description">
                Enter the receptionist's information
              </p>

              <Input
                label="Full Name"
                type="text"
                placeholder="Enter receptionist's full name"
                value={formData.receptionistName}
                onChange={(e) => handleChange('receptionistName', e.target.value)}
                error={errors.receptionistName}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="receptionist@example.com"
                value={formData.receptionistEmail}
                onChange={(e) => handleChange('receptionistEmail', e.target.value)}
                error={errors.receptionistEmail}
                required
                icon={<Mail size={20} />}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.receptionistPhone}
                onChange={(e) => handleChange('receptionistPhone', e.target.value)}
              />

              <div className="password-input-wrapper">
                <Input
                  label="Password"
                  type={showReceptionistPassword ? 'text' : 'password'}
                  placeholder="Create a password (min 6 characters)"
                  value={formData.receptionistPassword}
                  onChange={(e) => handleChange('receptionistPassword', e.target.value)}
                  error={errors.receptionistPassword}
                  required
                  icon={<Lock size={20} />}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowReceptionistPassword(!showReceptionistPassword)}
                >
                  {showReceptionistPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" className="submit-button">
                Create Receptionist Account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ReceptionistRegister;
