import React, { useState } from 'react';
import { 
  Building2,
  Users,
  TrendingUp,
  Activity,
  FileText,
  Shield,
  Search,
  Download
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './InsuranceDashboard.css';

function InsuranceDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const dashboardStats = {
    totalAssessments: 156,
    pending: 23,
    approved: 120,
    declined: 13
  };

  const pendingAssessments = [
    {
      id: 1,
      applicantName: 'Rahul Sharma',
      healthId: 'UH123456789',
      age: 34,
      policyType: 'Family Health',
      appliedDate: '2025-12-20',
      aiScore: 85,
      riskLevel: 'low'
    },
    {
      id: 2,
      applicantName: 'Priya Gupta',
      healthId: 'UH987654321',
      age: 28,
      policyType: 'Individual Health',
      appliedDate: '2025-12-21',
      aiScore: 92,
      riskLevel: 'low'
    },
    {
      id: 3,
      applicantName: 'Amit Kumar',
      healthId: 'UH456789123',
      age: 45,
      policyType: 'Critical Illness',
      appliedDate: '2025-12-22',
      aiScore: 68,
      riskLevel: 'medium'
    }
  ];

  const recentApprovals = [
    {
      id: 1,
      applicantName: 'Sanjay Patel',
      policyType: 'Family Health',
      premium: '₹15,000',
      approvedDate: '2025-12-23',
      aiScore: 88
    },
    {
      id: 2,
      applicantName: 'Meera Singh',
      policyType: 'Individual Health',
      premium: '₹8,500',
      approvedDate: '2025-12-23',
      aiScore: 91
    }
  ];

  const healthScoreDistribution = [
    { range: '90-100', count: 45, percentage: 29 },
    { range: '75-89', count: 68, percentage: 44 },
    { range: '60-74', count: 32, percentage: 20 },
    { range: '<60', count: 11, percentage: 7 }
  ];

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'risk-badge-low';
      case 'medium':
        return 'risk-badge-medium';
      case 'high':
        return 'risk-badge-high';
      default:
        return '';
    }
  };

  return (
    <div className="insurance-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Star Health Insurance</h1>
          <p className="dashboard-subtitle">{pendingAssessments.length} applications pending review</p>
        </div>
        <div className="header-actions">
          <Button variant="outline" icon={<Search size={20} />}>
            Search Application
          </Button>
          <Button icon={<Download size={20} />}>
            Export Reports
          </Button>
        </div>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card stat-card-primary">
          <div className="stat-icon">
            <FileText />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Assessments</div>
            <div className="stat-value">{dashboardStats.totalAssessments}</div>
            <div className="stat-description">This month</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <Activity />
          </div>
          <div className="stat-content">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{dashboardStats.pending}</div>
            <div className="stat-description">Awaiting decision</div>
          </div>
        </Card>

        <Card className="stat-card stat-card-success">
          <div className="stat-icon stat-icon-success">
            <Shield />
          </div>
          <div className="stat-content">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{dashboardStats.approved}</div>
            <div className="stat-description">Policies issued</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <div className="stat-label">Approval Rate</div>
            <div className="stat-value">
              {Math.round((dashboardStats.approved / dashboardStats.totalAssessments) * 100)}%
            </div>
            <div className="stat-description">Success ratio</div>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Users size={24} />
                Pending Assessments
              </h3>
              <Input
                type="text"
                placeholder="Search by Health ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <div className="assessments-list">
              {pendingAssessments.map(assessment => (
                <div key={assessment.id} className="assessment-item">
                  <div className="assessment-header">
                    <div className="applicant-info">
                      <div className="applicant-avatar">
                        {assessment.applicantName.charAt(0)}
                      </div>
                      <div>
                        <div className="applicant-name">{assessment.applicantName}</div>
                        <div className="applicant-id">Health ID: {assessment.healthId}</div>
                      </div>
                    </div>
                    <div className={`risk-badge ${getRiskBadgeClass(assessment.riskLevel)}`}>
                      {assessment.riskLevel} risk
                    </div>
                  </div>
                  <div className="assessment-details">
                    <div className="detail-item">
                      <span className="detail-label">Age:</span>
                      <span className="detail-value">{assessment.age} years</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Policy Type:</span>
                      <span className="detail-value">{assessment.policyType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applied:</span>
                      <span className="detail-value">
                        {new Date(assessment.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="ai-score-section">
                    <div className="ai-score-label">AI Health Score</div>
                    <div className="ai-score-bar">
                      <div 
                        className="ai-score-fill" 
                        style={{ width: `${assessment.aiScore}%` }}
                      ></div>
                    </div>
                    <div className="ai-score-value">{assessment.aiScore}/100</div>
                  </div>
                  <div className="assessment-actions">
                    <Button variant="secondary" size="small">
                      View Health Profile
                    </Button>
                    <Button variant="outline" size="small">
                      Decline
                    </Button>
                    <Button size="small">
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Health Score Distribution */}
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Activity size={24} />
                Health Score Distribution
              </h3>
            </div>
            <div className="score-distribution">
              {healthScoreDistribution.map((range, index) => (
                <div key={index} className="distribution-item">
                  <div className="distribution-header">
                    <span className="distribution-range">{range.range}</span>
                    <span className="distribution-count">{range.count} applicants</span>
                  </div>
                  <div className="distribution-bar">
                    <div 
                      className="distribution-fill"
                      style={{ width: `${range.percentage}%` }}
                    ></div>
                  </div>
                  <div className="distribution-percentage">{range.percentage}%</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="dashboard-sidebar">
          <Card className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <Shield size={24} />
                Recent Approvals
              </h3>
            </div>
            <div className="approvals-list">
              {recentApprovals.map(approval => (
                <div key={approval.id} className="approval-item">
                  <div className="approval-content">
                    <div className="approval-name">{approval.applicantName}</div>
                    <div className="approval-policy">{approval.policyType}</div>
                    <div className="approval-meta">
                      <span className="approval-premium">{approval.premium}/year</span>
                      <span className="approval-score">Score: {approval.aiScore}</span>
                    </div>
                    <div className="approval-date">
                      {new Date(approval.approvedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="dashboard-card quick-actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <Button variant="outline" fullWidth icon={<Search size={18} />}>
                Search Applicant
              </Button>
              <Button variant="outline" fullWidth icon={<FileText size={18} />}>
                View All Applications
              </Button>
              <Button variant="outline" fullWidth icon={<Download size={18} />}>
                Generate Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default InsuranceDashboard;
