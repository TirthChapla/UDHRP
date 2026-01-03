import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Heart } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Card from '../../components/Card/Card';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

function RegisterSimple() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT'
  });
  
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'PATIENT', label: 'Patient' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'LABORATORY', label: 'Laboratory' },
    { value: 'INSURANCE', label: 'Insurance Company' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) newErrors.role = 'Please select a role';
    
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
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        const role = result.data.role.toLowerCase();
        
        const dashboardRoutes = {
          patient: '/patient/dashboard',
          doctor: '/doctor/dashboard',
          laboratory: '/laboratory/dashboard',
          insurance: '/insurance/dashboard',
          receptionist: '/receptionist/dashboard',
          admin: '/admin/dashboard'
        };
        
        navigate(dashboardRoutes[role] || '/patient/dashboard');
      } else {
        setApiError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
              <h1>Join UDHRP</h1>
              <p>Create your account and start managing your healthcare digitally</p>
            </div>

            <div className="register-features">
              <div className="register-feature">
                <div className="register-feature-icon">✓</div>
                <div>Centralized health records</div>
              </div>
              <div className="register-feature">
                <div className="register-feature-icon">✓</div>
                <div>Easy appointment booking</div>
              </div>
              <div className="register-feature">
                <div className="register-feature-icon">✓</div>
                <div>AI-powered insights</div>
              </div>
            </div>
          </div>
        </div>

        <div className="register-form-wrapper">
          <Card className="register-card">
            <div className="register-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {apiError && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '8px',
                  color: '#c33',
                  marginBottom: '16px'
                }}>
                  {apiError}
                </div>
              )}

              <Select
                label="Register As"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                options={roleOptions}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                placeholder="1234567890"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                required
              />

              <div className="password-input-wrapper">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="password-input-wrapper">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
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

              <Button
                type="submit"
                fullWidth
                size="large"
                loading={loading}
              >
                Create Account
              </Button>
            </form>

            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Sign In
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RegisterSimple;
