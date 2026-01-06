import React from 'react';
import { X, Stethoscope, Star, Loader2 } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import Input from '../Input/Input';

function BookingModal({ doctor, appointmentDate, appointmentTime, onDateChange, onTimeChange, onConfirm, onClose, loading }) {
  if (!doctor) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    console.log('BookingModal handleConfirm called');
    console.log('appointmentDate:', appointmentDate);
    console.log('appointmentTime:', appointmentTime);
    
    if (!appointmentDate || !appointmentTime) {
      alert('Please select date and time');
      return;
    }
    console.log('Calling onConfirm...');
    onConfirm();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <Card className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="selected-doctor-info">
            <div className="doctor-avatar-modal">
              <Stethoscope size={32} />
            </div>
            <div>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
              {doctor.rating && (
                <div className="doctor-rating-modal">
                  <Star size={16} fill="currentColor" />
                  {doctor.rating} ({doctor.reviews} reviews)
                </div>
              )}
            </div>
          </div>

          <div className="booking-form">
            <Input
              type="date"
              label="Select Date"
              value={appointmentDate}
              onChange={(e) => onDateChange(e.target.value)}
              min={today}
              disabled={loading}
            />
            <Input
              type="time"
              label="Select Time"
              value={appointmentTime}
              onChange={(e) => onTimeChange(e.target.value)}
              disabled={loading}
            />
            
            {doctor.consultationFee && (
              <div className="consultation-fee-info">
                <span>Consultation Fee:</span>
                <strong>₹{doctor.consultationFee}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="loading-spinner" size={18} />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default BookingModal;
