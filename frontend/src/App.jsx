import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import LaboratoryDashboard from './pages/LaboratoryDashboard/LaboratoryDashboard';
import InsuranceDashboard from './pages/InsuranceDashboard/InsuranceDashboard';
import './styles/globals.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientActiveTab, setPatientActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (user && user.role === 'patient') {
      navigate('/patient/dashboard', { state: { searchQuery: query, activeTab: 'search-doctors' } });
    }
  };

  const handlePatientNavClick = (tab) => {
    if (user && user.role === 'patient') {
      setPatientActiveTab(tab);
      navigate('/patient/dashboard', { state: { activeTab: tab } });
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <div className="app">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onSearch={handleSearch} 
        onNavItemClick={handlePatientNavClick}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
          
          <Route 
            path="/patient/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard searchQuery={searchQuery} initialTab={patientActiveTab} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/laboratory/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['laboratory']}>
                <LaboratoryDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/insurance/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['insurance']}>
                <InsuranceDashboard />
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
      <AppContent />
    </Router>
  );
}

export default App;
