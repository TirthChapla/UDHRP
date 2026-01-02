import React, { useState } from 'react';
import { 
  FlaskConical,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  Search,
  Calendar
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './LaboratoryDashboard.css';

function LaboratoryDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const todayStats = {
    totalTests: 24,
    pending: 8,
    completed: 16,
    urgent: 3
  };

  const pendingSamples = [
    {
      id: 1,
      patientName: 'Rahul Sharma',
      patientId: 'UH123456789',
      testType: 'Complete Blood Count',
      sampleId: 'LAB2025001',
      collectedDate: '2025-12-23',
      priority: 'normal'
    },
    {
      id: 2,
      patientName: 'Priya Gupta',
      patientId: 'UH987654321',
      testType: 'Lipid Profile',
      sampleId: 'LAB2025002',
      collectedDate: '2025-12-23',
      priority: 'urgent'
    },
    {
      id: 3,
      patientName: 'Amit Kumar',
      patientId: 'UH456789123',
      testType: 'Liver Function Test',
      sampleId: 'LAB2025003',
      collectedDate: '2025-12-22',
      priority: 'normal'
    }
  ];

  const recentUploads = [
    {
      id: 1,
      patientName: 'Sanjay Patel',
      testType: 'Blood Sugar Test',
      uploadDate: '2025-12-23',
      status: 'delivered'
    },
    {
      id: 2,
      patientName: 'Meera Singh',
      testType: 'Thyroid Panel',
      uploadDate: '2025-12-23',
      status: 'delivered'
    },
    {
      id: 3,
      patientName: 'Vikram Reddy',
      testType: 'Kidney Function Test',
      uploadDate: '2025-12-22',
      status: 'delivered'
    }
  ];

  return (
    <div className="laboratory-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Metropolis Healthcare Lab</h1>
          <p className="dashboard-subtitle">{pendingSamples.length} samples pending for report upload</p>
        </div>
        <div className="header-actions">
          <Button variant="outline" icon={<Search size={20} />}>
            Search Patient
          </Button>
          <Button icon={<Upload size={20} />}>
            Upload Report
          </Button>
        </div>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card stat-card-primary">
          <div className="stat-icon">
            <FlaskConical />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Tests</div>
            <div className="stat-value">{todayStats.totalTests}</div>
            <div className="stat-description">Today</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <Clock />
          </div>
          <div className="stat-content">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{todayStats.pending}</div>
            <div className="stat-description">Awaiting reports</div>
          </div>
        </Card>

        <Card className="stat-card stat-card-success">
          <div className="stat-icon stat-icon-success">
            <CheckCircle2 />
          </div>
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{todayStats.completed}</div>
            <div className="stat-description">Reports uploaded</div>
          </div>
        </Card>

        <Card className="stat-card stat-card-urgent">
          <div className="stat-icon stat-icon-urgent">
            <Calendar />
          </div>
          <div className="stat-content">
            <div className="stat-label">Urgent</div>
            <div className="stat-value">{todayStats.urgent}</div>
            <div className="stat-description">Priority cases</div>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <FlaskConical size={24} />
                Pending Samples
              </h3>
              <Input
                type="text"
                placeholder="Search by patient ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <div className="samples-list">
              {pendingSamples.map(sample => (
                <div key={sample.id} className="sample-item">
                  <div className={`sample-priority priority-${sample.priority}`}></div>
                  <div className="sample-content">
                    <div className="sample-header">
                      <div>
                        <div className="sample-patient">{sample.patientName}</div>
                        <div className="sample-id">Patient ID: {sample.patientId}</div>
                      </div>
                      <div className="sample-badge">
                        {sample.sampleId}
                      </div>
                    </div>
                    <div className="sample-details">
                      <div className="sample-test">{sample.testType}</div>
                      <div className="sample-date">
                        Collected: {new Date(sample.collectedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="sample-actions">
                    <Button size="small" icon={<Upload size={16} />}>
                      Upload Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="dashboard-sidebar">
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <CheckCircle2 size={24} />
                Recent Uploads
              </h3>
            </div>
            <div className="uploads-list">
              {recentUploads.map(upload => (
                <div key={upload.id} className="upload-item">
                  <div className="upload-icon">
                    <FileText size={20} />
                  </div>
                  <div className="upload-content">
                    <div className="upload-patient">{upload.patientName}</div>
                    <div className="upload-test">{upload.testType}</div>
                    <div className="upload-date">
                      {new Date(upload.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`upload-status status-${upload.status}`}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="dashboard-card quick-actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <Button variant="outline" fullWidth icon={<Search size={18} />}>
                Search Patient
              </Button>
              <Button variant="outline" fullWidth icon={<Upload size={18} />}>
                Bulk Upload
              </Button>
              <Button variant="outline" fullWidth icon={<FileText size={18} />}>
                View History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LaboratoryDashboard;
