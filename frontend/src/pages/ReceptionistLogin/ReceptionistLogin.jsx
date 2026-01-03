import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import '../Login/Login.css';

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
    <div className="login-page">
      <div className="login-container">
        <div className="login-sidebar">
          <div className="login-sidebar-content">
            <Link to="/" className="login-logo">
              <Heart size={40} />
              <span>UDHRP</span>
            </Link>
            
            <div className="login-hero">
              <h1>Receptionist Portal</h1>
              <p>Manage appointments, patients, and help doctors provide better care</p>
            </div>

            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <div>Manage patient appointments</div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <div>Schedule and coordinate visits</div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <div>Streamline healthcare operations</div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-wrapper">
          <Card className="login-card">
            <div className="login-header">
              <h2>Receptionist Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="receptionist@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                required
              />

              <div className="password-input-wrapper">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
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

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                size="large"
              >
                Sign In
              </Button>
            </form>

            <div className="login-footer">
              <p>
                New receptionist?{' '}
                <Link to="/receptionist/register" className="register-link">
                  Create Account
                </Link>
              </p>
              <p style={{ marginTop: '12px' }}>
                <Link to="/login" className="register-link">
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

export default ReceptionistLogin;
