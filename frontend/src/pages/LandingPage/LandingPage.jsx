import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  Brain, 
  Bell, 
  Activity,
  FileText,
  Stethoscope,
  FlaskConical,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import './LandingPage.css';

function LandingPage() {
  const features = [
    {
      icon: <Heart size={32} />,
      title: 'Lifelong Health Records',
      description: 'Complete medical history from birth to present, all in one secure place'
    },
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered Insights',
      description: 'Preventive healthcare recommendations based on your medical history'
    },
    {
      icon: <Bell size={32} />,
      title: 'Smart Reminders',
      description: 'Never miss vaccinations, check-ups, or important health milestones'
    },
    {
      icon: <Shield size={32} />,
      title: 'Bank-Level Security',
      description: 'End-to-end encryption and role-based access control for your data'
    },
    {
      icon: <Activity size={32} />,
      title: 'Real-Time Sync',
      description: 'Instant updates from doctors, labs, and healthcare providers'
    },
    {
      icon: <Users size={32} />,
      title: 'Family Health',
      description: 'Manage health records for your entire family in one dashboard'
    }
  ];

  const userTypes = [
    {
      icon: <FileText size={40} />,
      title: 'For Patients',
      description: 'Access your complete medical history, book appointments, and get AI-powered health insights',
      link: '/register?role=patient',
      color: 'primary'
    },
    {
      icon: <Stethoscope size={40} />,
      title: 'For Doctors',
      description: 'Streamline consultations with instant patient history and digital prescriptions',
      link: '/register?role=doctor',
      color: 'secondary'
    },
    {
      icon: <FlaskConical size={40} />,
      title: 'For Laboratories',
      description: 'Upload reports directly to patient profiles with automatic notifications',
      link: '/register?role=laboratory',
      color: 'accent'
    },
    {
      icon: <Building2 size={40} />,
      title: 'For Insurance',
      description: 'AI-powered health scoring for accurate risk assessment and policy pricing',
      link: '/register?role=insurance',
      color: 'info'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Health Records' },
    { value: '50K+', label: 'Healthcare Providers' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>India's First Unified Health Record System</span>
            </div>
            
            <h1 className="hero-title">
              Your Health,
              <span className="hero-title-gradient"> Your Story,</span>
              <br />
              One Digital Record
            </h1>
            
            <p className="hero-description">
              UDHRP brings together your entire medical journey - from birth certificates 
              to the latest lab reports - in one secure, AI-powered platform. 
              Live healthier, live longer.
            </p>
            
            <div className="hero-actions">
              <Link to="/register">
                <Button size="large" icon={<Heart size={20} />}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/about">
                <Button size="large" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <Activity size={24} />
              <div>
                <div className="hero-card-title">Health Score</div>
                <div className="hero-card-value">98%</div>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <Bell size={24} />
              <div>
                <div className="hero-card-title">Upcoming</div>
                <div className="hero-card-value">Checkup Tomorrow</div>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <FileText size={24} />
              <div>
                <div className="hero-card-title">Records</div>
                <div className="hero-card-value">156 Documents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose UDHRP?</h2>
            <p className="section-description">
              A comprehensive health platform designed for India's healthcare ecosystem
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} hover className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="user-types-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Built for Everyone in Healthcare</h2>
            <p className="section-description">
              Tailored solutions for patients, doctors, laboratories, and insurance providers
            </p>
          </div>

          <div className="user-types-grid">
            {userTypes.map((type, index) => (
              <Card key={index} hover className={`user-type-card user-type-${type.color}`}>
                <div className="user-type-icon">{type.icon}</div>
                <h3 className="user-type-title">{type.title}</h3>
                <p className="user-type-description">{type.description}</p>
                <Link to={type.link} className="user-type-link">
                  Get Started <ArrowRight size={18} />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Get started in three simple steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Your Health ID</h3>
              <p className="step-description">
                Register with your Aadhaar and create your unique digital health ID
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Connect Healthcare Providers</h3>
              <p className="step-description">
                Link your doctors, labs, and insurance for automatic record updates
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Manage Your Health</h3>
              <p className="step-description">
                Access records, book appointments, and get AI-powered health insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Take Control of Your Health?</h2>
            <p className="cta-description">
              Join millions of Indians managing their health records digitally
            </p>
            <Link to="/register">
              <Button size="large" icon={<CheckCircle2 size={20} />}>
                Create Your Health ID
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
