import React from 'react';
import { Bell } from 'lucide-react';
import Card from '../Card/Card';

function Reminders({ reminders }) {
  return (
    <Card className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">
          <Bell size={24} />
          Reminders
        </h3>
      </div>
      <div className="reminders-list">
        {reminders.map(reminder => (
          <div key={reminder.id} className="reminder-item">
            <div className={`reminder-priority priority-${reminder.priority}`}></div>
            <div className="reminder-content">
              <div className="reminder-title">{reminder.title}</div>
              <div className="reminder-date">
                Due: {new Date(reminder.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Reminders;
