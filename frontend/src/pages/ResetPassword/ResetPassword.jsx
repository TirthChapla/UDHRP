import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, Heart } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Card from '../../components/Card/Card';
import authService from '../../services/authService';
import './ResetPassword.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!token) {
      setApiError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

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
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setApiError('Invalid reset token');
      return;
    }

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    
    try {
      const result = await authService.resetPassword(token, formData.newPassword);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setApiError(result.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-sidebar">
          <div className="reset-password-sidebar-content">
            <Link to="/" className="reset-password-logo">
              <Heart size={40} />
              <span>UDHRP</span>
            </Link>
            
            <div className="reset-password-hero">
              <h1>Create New Password</h1>
              <p>Your new password must be different from previously used passwords</p>
            </div>

            <div className="reset-password-features">
              <div className="reset-password-feature">
                <div className="reset-password-feature-icon">🔒</div>
                <div>Minimum 6 characters long</div>
              </div>
              <div className="reset-password-feature">
                <div className="reset-password-feature-icon">✓</div>
                <div>Secure password encryption</div>
              </div>
              <div className="reset-password-feature">
                <div className="reset-password-feature-icon">🔐</div>
                <div>Immediate account access</div>
              </div>
            </div>
          </div>
        </div>

        <div className="reset-password-form-wrapper">
          <Card className="reset-password-card">
            {!success ? (
              <>
                <div className="reset-password-header">
                  <h2>Set New Password</h2>
                  <p>Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                  {apiError && (
                    <div className="error-message">
                      {apiError}
                    </div>
                  )}

                  <div className="password-input-wrapper">
                    <Input
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      error={errors.newPassword}
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

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    loading={loading}
                    disabled={!token}
                  >
                    Reset Password
                  </Button>
                </form>

                <div className="reset-password-footer">
                  <p>
                    Remember your password?{' '}
                    <Link to="/login" className="login-link">
                      Back to Login
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <div className="success-container">
                <div className="success-icon">
                  <CheckCircle size={64} />
                </div>
                <h2>Password Reset Successful!</h2>
                <p className="success-message">
                  Your password has been successfully reset.
                </p>
                <p className="success-note">
                  Redirecting you to login page...
                </p>
                <Link to="/login" className="back-button">
                  <Button fullWidth size="large">
                    Go to Login
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
