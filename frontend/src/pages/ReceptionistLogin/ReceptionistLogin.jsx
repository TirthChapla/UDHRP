import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './ReceptionistLogin.css';

function ReceptionistLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock login - replace with API call
    console.log('Logging in:', formData);
    
    // Simulate successful login
    localStorage.setItem('userRole', 'receptionist');
    navigate('/receptionist/dashboard');
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="receptionist-login">
      <div className="login-container">
        <Card variant="default" className="login-card">
          <div className="login-header">
            <div className="header-icon">
              <LogIn size={32} />
            </div>
            <h1>Receptionist Login</h1>
            <p>Sign in to manage appointments and patients</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Email Address"
              type="email"
              placeholder="receptionist@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
              icon={<Mail size={20} />}
            />

            <div className="password-input-wrapper">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                required
                icon={<Lock size={20} />}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type="submit" className="login-button">
              Sign In
            </Button>
          </form>

          <div className="login-footer">
            <div className="divider">
              <span>New receptionist?</span>
            </div>
            <Link to="/receptionist/register" className="register-link">
              <UserPlus size={20} />
              Create Account (Doctor Verification Required)
            </Link>
          </div>

          <div className="back-to-main">
            <Link to="/login">← Back to Main Login</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ReceptionistLogin;
