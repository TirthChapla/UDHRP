import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Heart, Key, LogIn } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Card from '../../components/Card/Card';
import authService from '../../services/authService';
import './ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setOtpSent(true);
        setStep(2);
      } else {
        setError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await authService.verifyOtp(email, otp);
      
      if (result.success) {
        setStep(3);
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError('Password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await authService.resetPasswordWithOtp(email, otp, newPassword);
      
      if (result.success && result.data) {
        // Auto-login successful, redirect to appropriate dashboard
        const role = result.data.role.toLowerCase();
        
        setTimeout(() => {
          if (role === 'patient') {
            navigate('/patient/dashboard');
          } else if (role === 'doctor') {
            navigate('/doctor/dashboard');
          } else if (role === 'receptionist') {
            navigate('/receptionist/dashboard');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setError(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-sidebar">
          <div className="forgot-password-sidebar-content">
            <Link to="/" className="forgot-password-logo">
              <Heart size={40} />
              <span>UDHRP</span>
            </Link>
            
            <div className="forgot-password-hero">
              <h1>Reset Your Password</h1>
              <p>
                {step === 1 && "Enter your email to receive a verification code"}
                {step === 2 && "Enter the 6-digit code sent to your email"}
                {step === 3 && "Create a new password for your account"}
              </p>
            </div>

            <div className="forgot-password-features">
              <div className="forgot-password-feature">
                <div className="forgot-password-feature-icon">🔒</div>
                <div>Secure OTP verification</div>
              </div>
              <div className="forgot-password-feature">
                <div className="forgot-password-feature-icon">⏱️</div>
                <div>OTP valid for 10 minutes</div>
              </div>
              <div className="forgot-password-feature">
                <div className="forgot-password-feature-icon">
                  {step === 3 ? '✓' : '✉️'}
                </div>
                <div>
                  {step === 3 ? 'Auto-login after reset' : 'Instant email delivery'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="forgot-password-form-wrapper">
          <Card className="forgot-password-card">
            {/* Step 1: Enter Email */}
            {step === 1 && (
              <>
                <div className="forgot-password-header">
                  <h2>Forgot Password?</h2>
                  <p>Enter your email to receive a verification code</p>
                </div>

                <form onSubmit={handleSendOtp} className="forgot-password-form">
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    loading={loading}
                  >
                    Send OTP
                  </Button>
                </form>

                <div className="forgot-password-footer">
                  <Link to="/login" className="back-to-login">
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              </>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <>
                <div className="forgot-password-header">
                  <div className="success-icon-small">
                    <Mail size={48} />
                  </div>
                  <h2>Check Your Email</h2>
                  <p>We've sent a 6-digit code to <strong>{email}</strong></p>
                </div>

                <form onSubmit={handleVerifyOtp} className="forgot-password-form">
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <Input
                    label="Verification Code"
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                      setError('');
                    }}
                    maxLength={6}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    loading={loading}
                  >
                    Verify OTP
                  </Button>
                </form>

                <div className="forgot-password-footer">
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setError('');
                    }}
                    className="back-to-login"
                  >
                    <ArrowLeft size={16} />
                    Change Email
                  </button>
                  <button
                    onClick={handleSendOtp}
                    className="resend-link"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <>
                <div className="forgot-password-header">
                  <div className="success-icon-small">
                    <Key size={48} />
                  </div>
                  <h2>Create New Password</h2>
                  <p>You'll be automatically logged in after resetting</p>
                </div>

                <form onSubmit={handleResetPassword} className="forgot-password-form">
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    loading={loading}
                  >
                    {loading ? 'Resetting...' : (
                      <>
                        <LogIn size={20} />
                        Reset & Login
                      </>
                    )}
                  </Button>
                </form>

                <div className="forgot-password-footer">
                  <button
                    onClick={() => {
                      setStep(2);
                      setNewPassword('');
                      setConfirmPassword('');
                      setError('');
                    }}
                    className="back-to-login"
                  >
                    <ArrowLeft size={16} />
                    Back to OTP
                  </button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
