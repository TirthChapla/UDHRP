import React from 'react';
import { Heart, User, Stethoscope, Calendar, FileText, FlaskRound, Home } from 'lucide-react';

function PatientSidebar({ activeTab, onTabChange }) {
  return (
    <div className="patient-sidebar">
      <div className="sidebar-header">
        <Heart size={28} />
        <h2>Patient Portal</h2>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <User size={20} />
          <span>My Profile</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'search-doctors' ? 'active' : ''}`}
          onClick={() => onTabChange('search-doctors')}
        >
          <Stethoscope size={20} />
          <span>Find Doctors</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => onTabChange('appointments')}
        >
          <Calendar size={20} />
          <span>My Appointments</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => onTabChange('records')}
        >
          <FileText size={20} />
          <span>Medical Records</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'labs' ? 'active' : ''}`}
          onClick={() => onTabChange('labs')}
        >
          <FlaskRound size={20} />
          <span>Lab Reports</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => onTabChange('overview')}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </button>
      </nav>
    </div>
  );
}

export default PatientSidebar;
