import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Heart, Building } from 'lucide-react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Card from '../../components/Card/Card';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'patient';
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [apiError, setApiError] = useState('');
  
  const [formData, setFormData] = useState({
    role: roleParam.toLowerCase(),
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    // Receptionist specific
    department: '',
    employeeId: ''
  });
  
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'patient', label: 'Patient' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'insurance', label: 'Insurance Company' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const stateOptions = [
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'tamil_nadu', label: 'Tamil Nadu' },
    // Add more states
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

  const validateStep1 = () => {
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Receptionist-specific validations
    if (formData.role === 'receptionist') {
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.role === 'patient') {
      if (!formData.aadhaar) {
        newErrors.aadhaar = 'Aadhaar number is required';
      } else if (!/^\d{12}$/.test(formData.aadhaar)) {
        newErrors.aadhaar = 'Aadhaar must be 12 digits';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else if (formData.role === 'doctor') {
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
      if (!formData.specialization) newErrors.specialization = 'Specialization is required';
      if (!formData.experience) newErrors.experience = 'Experience is required';
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    } else if (formData.role === 'laboratory') {
      if (!formData.labName) newErrors.labName = 'Laboratory name is required';
      if (!formData.labLicense) newErrors.labLicense = 'License number is required';
    } else if (formData.role === 'insurance') {
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.companyRegNumber) newErrors.companyRegNumber = 'Registration number is required';
    }
    
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateStep2();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    
    try {
      // Prepare data for backend API
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        role: formData.role.toUpperCase()
      };

      // Add receptionist-specific fields if role is receptionist
      if (formData.role === 'receptionist') {
        registrationData.department = formData.department;
        registrationData.employeeId = formData.employeeId;
      }

      // Call the register function from AuthContext
      const result = await register(registrationData);
      
      if (result.success) {
        // Redirect to appropriate dashboard based on role
        const dashboardRoutes = {
          patient: '/patient/dashboard',
          doctor: '/doctor/dashboard',
          receptionist: '/receptionist/dashboard',
          laboratory: '/laboratory/dashboard',
          insurance: '/insurance/dashboard'
        };
        
        navigate(dashboardRoutes[formData.role] || '/patient/dashboard');
      } else {
        setApiError(result.error || 'Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const renderRoleIcon = () => {
    switch (formData.role) {
      case 'doctor':
        return <User size={24} />;
      case 'laboratory':
        return <Building size={24} />;
      case 'insurance':
        return <Building size={24} />;
      default:
        return <Heart size={24} />;
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

            <div className="register-progress">
              <div className="progress-step">
                <div className={`progress-step-circle ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                <div className="progress-step-label">Account Details</div>
              </div>
              <div className="progress-line">
                <div className={`progress-line-fill ${currentStep >= 2 ? 'active' : ''}`}></div>
              </div>
              <div className="progress-step">
                <div className={`progress-step-circle ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                <div className="progress-step-label">Additional Information</div>
              </div>
            </div>
          </div>
        </div>

        <div className="register-form-wrapper">
          <Card className="register-card">
            <div className="register-header">
              <div className="register-role-badge">
                {renderRoleIcon()}
                <span>Register as {formData.role}</span>
              </div>
              <h2>Create Account</h2>
              <p>Step {currentStep} of 2</p>
            </div>

            {apiError && (
              <div className="error-message" style={{ 
                backgroundColor: '#fee', 
                color: '#c33', 
                padding: '12px', 
                borderRadius: '6px', 
                marginBottom: '16px',
                border: '1px solid #fcc'
              }}>
                {apiError}
              </div>
            )}

            <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="register-form">
              {currentStep === 1 && (
                <div className="form-step">
                  <Select
                    label="Register As"
                    options={roleOptions}
                    value={formData.role}
                    onChange={handleChange}
                    name="role"
                    required
                  />

                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                  />

                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
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
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    placeholder="10-digit mobile number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={errors.phoneNumber}
                    required
                  />

                  {formData.role === 'receptionist' && (
                    <>
                      <Input
                        label="Department"
                        type="text"
                        name="department"
                        placeholder="Enter department name"
                        value={formData.department}
                        onChange={handleChange}
                        error={errors.department}
                        required
                      />

                      <Input
                        label="Employee ID"
                        type="text"
                        name="employeeId"
                        placeholder="Enter employee ID"
                        value={formData.employeeId}
                        onChange={handleChange}
                        error={errors.employeeId}
                        required
                      />
                    </>
                  )}

                  <div className="password-input-wrapper">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      helperText="At least 8 characters"
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
                      placeholder="Re-enter your password"
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

                  <Button type="submit" fullWidth size="large">
                    Continue
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-step">
                  {formData.role === 'patient' && (
                    <>
                      <Input
                        label="Aadhaar Number"
                        type="text"
                        name="aadhaar"
                        placeholder="12-digit Aadhaar number"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        error={errors.aadhaar}
                        required
                      />

                      <Input
                        label="Date of Birth"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        error={errors.dateOfBirth}
                        required
                      />

                      <Select
                        label="Gender"
                        options={genderOptions}
                        value={formData.gender}
                        onChange={handleChange}
                        name="gender"
                        error={errors.gender}
                        required
                      />
                    </>
                  )}

                  {formData.role === 'doctor' && (
                    <>
                      <Input
                        label="Medical License Number"
                        type="text"
                        name="licenseNumber"
                        placeholder="Your medical license number"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        error={errors.licenseNumber}
                        required
                      />

                      <Input
                        label="Specialization"
                        type="text"
                        name="specialization"
                        placeholder="e.g., Cardiology, Pediatrics"
                        value={formData.specialization}
                        onChange={handleChange}
                        error={errors.specialization}
                        required
                      />

                      <Input
                        label="Years of Experience"
                        type="number"
                        name="experience"
                        placeholder="Years of practice"
                        value={formData.experience}
                        onChange={handleChange}
                        error={errors.experience}
                        required
                      />

                      <Input
                        label="Qualification"
                        type="text"
                        name="qualification"
                        placeholder="e.g., MBBS, MD"
                        value={formData.qualification}
                        onChange={handleChange}
                        error={errors.qualification}
                        required
                      />
                    </>
                  )}

                  {formData.role === 'laboratory' && (
                    <>
                      <Input
                        label="Laboratory Name"
                        type="text"
                        name="labName"
                        placeholder="Official laboratory name"
                        value={formData.labName}
                        onChange={handleChange}
                        error={errors.labName}
                        required
                      />

                      <Input
                        label="License Number"
                        type="text"
                        name="labLicense"
                        placeholder="Government-issued license"
                        value={formData.labLicense}
                        onChange={handleChange}
                        error={errors.labLicense}
                        required
                      />
                    </>
                  )}

                  {formData.role === 'insurance' && (
                    <>
                      <Input
                        label="Company Name"
                        type="text"
                        name="companyName"
                        placeholder="Insurance company name"
                        value={formData.companyName}
                        onChange={handleChange}
                        error={errors.companyName}
                        required
                      />

                      <Input
                        label="Registration Number"
                        type="text"
                        name="companyRegNumber"
                        placeholder="Company registration number"
                        value={formData.companyRegNumber}
                        onChange={handleChange}
                        error={errors.companyRegNumber}
                        required
                      />
                    </>
                  )}

                  <Input
                    label="Address"
                    type="text"
                    name="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    required
                  />

                  <div className="form-row">
                    <Input
                      label="City"
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      required
                    />

                    <Select
                      label="State"
                      options={stateOptions}
                      value={formData.state}
                      onChange={handleChange}
                      name="state"
                      error={errors.state}
                      required
                    />
                  </div>

                  <Input
                    label="Pincode"
                    type="text"
                    name="pincode"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={errors.pincode}
                    required
                  />

                  <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="submit" loading={loading}>
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
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

export default Register;
