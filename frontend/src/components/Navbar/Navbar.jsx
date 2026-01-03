import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Search, Heart, Stethoscope, Calendar, FileText, FlaskRound, Home } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout, onSearch, onNavItemClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handlePatientNavClick = (tab) => {
    setMobileMenuOpen(false);
    if (onNavItemClick) {
      onNavItemClick(tab);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'patient':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'laboratory':
        return '/laboratory/dashboard';
      case 'insurance':
        return '/insurance/dashboard';
      case 'receptionist':
        return '/receptionist/dashboard';
      default:
        return '/';
    }
  };

  // Receptionist-specific navbar
  if (user && user.role === 'receptionist') {
    return (
      <nav className="navbar navbar-receptionist">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Heart className="navbar-logo-icon" />
            <span className="navbar-logo-text">UDHRP</span>
          </Link>

          <div className={`navbar-receptionist-menu ${mobileMenuOpen ? 'navbar-menu-open' : ''}`}>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/receptionist/dashboard'); }} className="navbar-receptionist-link">
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/receptionist/profile'); }} className="navbar-receptionist-link">
              <User size={20} />
              <span>My Profile</span>
            </button>
          </div>

          <div className="navbar-actions">
            <div className="navbar-user-menu">
              <button 
                className="navbar-user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="navbar-user-avatar">
                  {user.name?.charAt(0) || 'R'}
                </div>
              </button>

              {userMenuOpen && (
                <div className="navbar-dropdown">
                  <button onClick={handleLogout} className="navbar-dropdown-item navbar-dropdown-logout">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button 
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Doctor-specific navbar
  if (user && user.role === 'doctor') {
    return (
      <nav className="navbar navbar-doctor">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Heart className="navbar-logo-icon" />
            <span className="navbar-logo-text">UDHRP</span>
          </Link>

          <div className={`navbar-doctor-menu ${mobileMenuOpen ? 'navbar-menu-open' : ''}`}>
            <button onClick={() => handlePatientNavClick('profile')} className="navbar-doctor-link">
              <User size={20} />
              <span>My Profile</span>
            </button>
            <button onClick={() => handlePatientNavClick('dashboard')} className="navbar-doctor-link">
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/doctor/prescription'); }} className="navbar-doctor-link">
              <FileText size={20} />
              <span>Prescription</span>
            </button>
            <button onClick={() => handlePatientNavClick('schedule')} className="navbar-doctor-link">
              <Calendar size={20} />
              <span>View Schedule</span>
            </button>
          </div>

          <div className="navbar-actions">
            <div className="navbar-user-menu">
              <button 
                className="navbar-user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="navbar-user-avatar">
                  {user.name?.charAt(0) || 'U'}
                </div>
              </button>

              {userMenuOpen && (
                <div className="navbar-dropdown">
                  <button onClick={handleLogout} className="navbar-dropdown-item navbar-dropdown-logout">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button 
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Patient-specific navbar
  if (user && user.role === 'patient') {
    return (
      <nav className="navbar navbar-patient">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Heart className="navbar-logo-icon" />
            <span className="navbar-logo-text">UDHRP</span>
          </Link>

          <div className={`navbar-patient-menu ${mobileMenuOpen ? 'navbar-menu-open' : ''}`}>
            <button onClick={() => handlePatientNavClick('profile')} className="navbar-patient-link">
              <User size={20} />
              <span>My Profile</span>
            </button>
            <button onClick={() => handlePatientNavClick('search-doctors')} className="navbar-patient-link">
              <Stethoscope size={20} />
              <span>Find Doctors</span>
            </button>
            <button onClick={() => handlePatientNavClick('appointments')} className="navbar-patient-link">
              <Calendar size={20} />
              <span>My Appointments</span>
            </button>
            <button onClick={() => handlePatientNavClick('records')} className="navbar-patient-link">
              <FileText size={20} />
              <span>Medical Records</span>
            </button>
            <button onClick={() => handlePatientNavClick('labs')} className="navbar-patient-link">
              <FlaskRound size={20} />
              <span>Lab Reports</span>
            </button>
            <button onClick={() => handlePatientNavClick('overview')} className="navbar-patient-link">
              <Home size={20} />
              <span>Dashboard</span>
            </button>
          </div>

          <div className="navbar-actions">
            <div className="navbar-user-menu">
              <button 
                className="navbar-user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="navbar-user-avatar">
                  {user.name?.charAt(0) || 'U'}
                </div>
              </button>

              {userMenuOpen && (
                <div className="navbar-dropdown">
                  <button onClick={handleLogout} className="navbar-dropdown-item navbar-dropdown-logout">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button 
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Default navbar for non-patient users
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Heart className="navbar-logo-icon" />
          <span className="navbar-logo-text">UDHRP</span>
        </Link>

        <div className={`navbar-menu ${mobileMenuOpen ? 'navbar-menu-open' : ''}`}>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/services" className="navbar-link">Services</Link>
          <Link to="/features" className="navbar-link">Features</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user-menu">
              <button 
                className="navbar-user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="navbar-user-avatar">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="navbar-user-name">{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="navbar-dropdown">
                  <button onClick={handleLogout} className="navbar-dropdown-item navbar-dropdown-logout">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-button navbar-button-secondary">
                Sign In
              </Link>
              <Link to="/register" className="navbar-button navbar-button-primary">
                Get Started
              </Link>
            </>
          )}

          <button 
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
