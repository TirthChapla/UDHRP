import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import RegisterSimple from './pages/Register/RegisterSimple';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import DoctorPrescription from './pages/DoctorPrescription/DoctorPrescription';
import LaboratoryDashboard from './pages/LaboratoryDashboard/LaboratoryDashboard';
import InsuranceDashboard from './pages/InsuranceDashboard/InsuranceDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard/ReceptionistDashboard';
import ReceptionistLogin from './pages/ReceptionistLogin/ReceptionistLogin';
import ReceptionistProfile from './pages/ReceptionistProfile/ReceptionistProfile';
import ReceptionistSchedule from './pages/ReceptionistSchedule/ReceptionistSchedule';
import './styles/globals.css';

function AppContent() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [patientActiveTab, setPatientActiveTab] = useState('overview');
  const [doctorActiveTab, setDoctorActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (user && user.role === 'PATIENT') {
      navigate('/patient/dashboard', { state: { searchQuery: query, activeTab: 'search-doctors' } });
    }
  };

  const handlePatientNavClick = (tab) => {
    if (user && user.role === 'PATIENT') {
      setPatientActiveTab(tab);
      navigate('/patient/dashboard', { state: { activeTab: tab } });
    } else if (user && user.role === 'DOCTOR') {
      setDoctorActiveTab(tab);
      navigate('/doctor/dashboard', { state: { activeTab: tab } });
    }
  };

  return (
    <div className="app">
      <Navbar 
        user={user} 
        onLogout={logout} 
        onSearch={handleSearch} 
        onNavItemClick={handlePatientNavClick}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterSimple />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route 
            path="/patient/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientDashboard searchQuery={searchQuery} initialTab={patientActiveTab} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/doctor/prescription" 
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorPrescription />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/laboratory/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['LABORATORY']}>
                <LaboratoryDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/insurance/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['INSURANCE']}>
                <InsuranceDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Receptionist Routes */}
          <Route path="/receptionist/login" element={<ReceptionistLogin />} />
          
          <Route 
            path="/receptionist/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/receptionist/profile" 
            element={
              <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                <ReceptionistProfile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/receptionist/schedule" 
            element={
              <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
                <ReceptionistSchedule />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
