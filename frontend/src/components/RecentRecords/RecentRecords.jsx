import React from 'react';
import { FileText } from 'lucide-react';
import Card from '../Card/Card';

function RecentRecords({ records }) {
  return (
    <Card className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">
          <FileText size={24} />
          Recent Records
        </h3>
      </div>
      <div className="records-list">
        {records.map(record => (
          <div key={record.id} className="record-item">
            <div className="record-icon">
              <FileText size={20} />
            </div>
            <div className="record-content">
              <div className="record-title">{record.title}</div>
              <div className="record-meta">
                {record.doctor || record.lab} • {new Date(record.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentRecords;
