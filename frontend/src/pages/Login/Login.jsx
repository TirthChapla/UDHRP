import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Card from '../../components/Card/Card';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});

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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
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
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: formData.email,
        role: formData.role
      };
      
      if (onLogin) {
        onLogin(mockUser);
      }
      
      setLoading(false);
      
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        laboratory: '/laboratory/dashboard',
        insurance: '/insurance/dashboard'
      };
      
      navigate(dashboardRoutes[formData.role] || '/patient/dashboard');
    }, 1500);
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
              <h1>Welcome Back</h1>
              <p>Access your complete health records and manage your healthcare journey</p>
            </div>

            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <div>Secure access to all your medical records</div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <div>Book appointments with healthcare providers</div>
              </div>
              <div className="login-feature">
                <div className="login-feature-icon">✓</div>
                <div>AI-powered health insights and reminders</div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-wrapper">
          <Card className="login-card">
            <div className="login-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Select
                label="Login As"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                options={[
                  { value: 'patient', label: 'Patient' },
                  { value: 'doctor', label: 'Doctor' },
                  { value: 'laboratory', label: 'Laboratory' },
                  { value: 'insurance', label: 'Insurance Company' }
                ]}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail size={20} />}
                required
              />

              <div className="password-input-wrapper">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock size={20} />}
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
                loading={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="register-link">
                  Create Account
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
