import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, Shield, Heart } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import '../Register/Register.css';

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
    <div className="register-page">
      <div className="register-container">
        <div className="register-sidebar">
          <div className="register-sidebar-content">
            <Link to="/" className="register-logo">
              <Heart size={40} />
              <span>UDHRP</span>
            </Link>
            
            <div className="register-hero">
              <h1>Join as Receptionist</h1>
              <p>Require doctor verification to create your receptionist account</p>
            </div>

            <div className="register-progress">
              <div className="progress-step">
                <div className="progress-step-circle active">
                  <Shield size={20} />
                </div>
                <span className="progress-step-label">Doctor Verification</span>
              </div>
              <div className="progress-line">
                <div className="progress-line-fill active"></div>
              </div>
              <div className="progress-step">
                <div className="progress-step-circle active">
                  <UserPlus size={20} />
                </div>
                <span className="progress-step-label">Receptionist Info</span>
              </div>
            </div>
          </div>
        </div>

        <div className="register-form-wrapper">
          <Card className="register-card">
            <div className="register-header">
              <div className="register-role-badge">
                <Shield size={16} />
                Receptionist Registration
              </div>
              <h2>Create Account</h2>
              <p>Doctor verification required</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-step">
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  <Shield size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  Doctor Verification
                </h3>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  Doctor must provide credentials to authorize
                </p>

                <Input
                  label="Doctor Email"
                  type="email"
                  name="doctorEmail"
                  placeholder="doctor@example.com"
                  value={formData.doctorEmail}
                  onChange={(e) => handleChange('doctorEmail', e.target.value)}
                  error={errors.doctorEmail}
                  required
                />

                <div className="password-input-wrapper">
                  <Input
                    label="Doctor Password"
                    type={showDoctorPassword ? 'text' : 'password'}
                    name="doctorPassword"
                    placeholder="Enter doctor's password"
                    value={formData.doctorPassword}
                    onChange={(e) => handleChange('doctorPassword', e.target.value)}
                    error={errors.doctorPassword}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowDoctorPassword(!showDoctorPassword)}
                  >
                    {showDoctorPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div style={{ margin: '24px 0', borderTop: '1px solid #e5e7eb' }}></div>

                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  <UserPlus size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  Receptionist Details
                </h3>

                <Input
                  label="Full Name"
                  type="text"
                  name="receptionistName"
                  placeholder="Enter receptionist's full name"
                  value={formData.receptionistName}
                  onChange={(e) => handleChange('receptionistName', e.target.value)}
                  error={errors.receptionistName}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="receptionistEmail"
                  placeholder="receptionist@example.com"
                  value={formData.receptionistEmail}
                  onChange={(e) => handleChange('receptionistEmail', e.target.value)}
                  error={errors.receptionistEmail}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="receptionistPhone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.receptionistPhone}
                  onChange={(e) => handleChange('receptionistPhone', e.target.value)}
                />

                <div className="password-input-wrapper">
                  <Input
                    label="Password"
                    type={showReceptionistPassword ? 'text' : 'password'}
                    name="receptionistPassword"
                    placeholder="Create a password (min 6 characters)"
                    value={formData.receptionistPassword}
                    onChange={(e) => handleChange('receptionistPassword', e.target.value)}
                    error={errors.receptionistPassword}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowReceptionistPassword(!showReceptionistPassword)}
                  >
                    {showReceptionistPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  style={{ marginTop: '8px' }}
                >
                  Create Receptionist Account
                </Button>
              </div>
            </form>

            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/receptionist/login" className="login-link">
                  Sign In
                </Link>
              </p>
              <p style={{ marginTop: '8px' }}>
                <Link to="/login" className="login-link">
                  ← Back to Main Login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistRegister;
