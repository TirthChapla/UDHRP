import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import Card from '../Card/Card';

function HealthMetrics({ metrics }) {
  return (
    <Card className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={24} />
          Health Metrics
        </h3>
      </div>
      <div className="health-metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="health-metric">
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">
              {metric.value}
              <span className="metric-unit">{metric.unit}</span>
            </div>
            <div className={`metric-status status-${metric.status}`}>
              <CheckCircle2 size={14} />
              Normal
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default HealthMetrics;
