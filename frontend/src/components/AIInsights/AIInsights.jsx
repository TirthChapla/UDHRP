import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import Card from '../Card/Card';

function AIInsights({ insights }) {
  return (
    <Card className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={24} />
          AI Health Insights
        </h3>
      </div>
      <div className="ai-insights-list">
        {insights.map((insight, index) => (
          <div key={index} className={`ai-insight insight-${insight.type}`}>
            <div className="insight-icon">
              <AlertCircle size={20} />
            </div>
            <div className="insight-content">
              <div className="insight-title">{insight.title}</div>
              <div className="insight-message">{insight.message}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AIInsights;
