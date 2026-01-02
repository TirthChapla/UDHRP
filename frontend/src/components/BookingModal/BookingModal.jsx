import React from 'react';
import { X, Stethoscope, Star } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import Input from '../Input/Input';

function BookingModal({ doctor, appointmentDate, appointmentTime, onDateChange, onTimeChange, onConfirm, onClose }) {
  if (!doctor) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!appointmentDate || !appointmentTime) {
      alert('Please select date and time');
      return;
    }
    onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <Card className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
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
              <div className="doctor-rating-modal">
                <Star size={16} fill="currentColor" />
                {doctor.rating} ({doctor.reviews} reviews)
              </div>
            </div>
          </div>

          <div className="booking-form">
            <Input
              type="date"
              label="Select Date"
              value={appointmentDate}
              onChange={(e) => onDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <Input
              type="time"
              label="Select Time"
              value={appointmentTime}
              onChange={(e) => onTimeChange(e.target.value)}
            />
            
            <div className="consultation-fee-info">
              <span>Consultation Fee:</span>
              <strong>₹{doctor.consultationFee}</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Booking
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default BookingModal;
