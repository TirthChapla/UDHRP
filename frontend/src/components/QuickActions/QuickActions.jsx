import React from 'react';
import { Search, FileText, User } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function QuickActions({ onFindDoctor, onViewRecords, onUpdateProfile }) {
  return (
    <Card className="dashboard-card quick-actions-card">
      <h3 className="card-title">Quick Actions</h3>
      <div className="quick-actions">
        <Button 
          variant="outline" 
          fullWidth 
          icon={<Search size={18} />}
          onClick={onFindDoctor}
        >
          Find Doctor
        </Button>
        <Button 
          variant="outline" 
          fullWidth 
          icon={<FileText size={18} />}
          onClick={onViewRecords}
        >
          View Records
        </Button>
        <Button 
          variant="outline" 
          fullWidth 
          icon={<User size={18} />}
          onClick={onUpdateProfile}
        >
          Update Profile
        </Button>
      </div>
    </Card>
  );
}

export default QuickActions;
