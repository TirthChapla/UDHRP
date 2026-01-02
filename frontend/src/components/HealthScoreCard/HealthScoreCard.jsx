import React from 'react';
import { Heart, TrendingUp } from 'lucide-react';
import Card from '../Card/Card';

function HealthScoreCard({ score }) {
  return (
    <Card className="stat-card stat-card-primary">
      <div className="stat-icon">
        <Heart />
      </div>
      <div className="stat-content">
        <div className="stat-label">Health Score</div>
        <div className="stat-value">{score}%</div>
        <div className="stat-change positive">
          <TrendingUp size={16} />
          <span>+5% from last month</span>
        </div>
      </div>
    </Card>
  );
}

export default HealthScoreCard;
