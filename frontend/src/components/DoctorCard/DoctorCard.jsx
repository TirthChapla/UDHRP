import React from 'react';
import { 
  Stethoscope, 
  Star, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  Calendar 
} from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

function DoctorCard({ doctor, onBookAppointment, showBookButton = true, showNextAvailable = true }) {
  return (
    <Card className="doctor-card" hover>
      <div className="doctor-card-header">
        <div className="doctor-avatar">
          <Stethoscope size={32} />
        </div>
        <div className="doctor-basic-info">
          <h3 className="doctor-name">{doctor.name || doctor.doctorName}</h3>
          <div className="doctor-specialization">
            <Award size={16} />
            {doctor.specialization || doctor.doctorSpecialization}
          </div>
          {doctor.rating && (
            <div className="doctor-rating">
              <Star size={16} fill="currentColor" />
              <span className="rating-value">{doctor.rating}</span>
              <span className="rating-reviews">({doctor.reviews} reviews)</span>
            </div>
          )}
        </div>
      </div>

      <div className="doctor-details">
        {doctor.qualification && (
          <div className="detail-row">
            <Award size={18} />
            <div className="detail-content">
              <div className="detail-label">Qualification</div>
              <div className="detail-value">{doctor.qualification}</div>
            </div>
          </div>
        )}

        {doctor.experience && (
          <div className="detail-row">
            <CheckCircle2 size={18} />
            <div className="detail-content">
              <div className="detail-label">Experience</div>
              <div className="detail-value">{doctor.experience} years</div>
            </div>
          </div>
        )}

        {doctor.address && (
          <div className="detail-row">
            <MapPin size={18} />
            <div className="detail-content">
              <div className="detail-label">Practice Address</div>
              <div className="detail-value">{doctor.address}</div>
            </div>
          </div>
        )}

        {doctor.availability && (
          <div className="detail-row">
            <Clock size={18} />
            <div className="detail-content">
              <div className="detail-label">Availability</div>
              <div className="detail-value">{doctor.availability}</div>
            </div>
          </div>
        )}

        {doctor.phone && (
          <div className="detail-row">
            <Phone size={18} />
            <div className="detail-content">
              <div className="detail-label">Contact</div>
              <div className="detail-value">{doctor.phone}</div>
            </div>
          </div>
        )}

        {doctor.languages && doctor.languages.length > 0 && (
          <div className="doctor-languages">
            <span className="languages-label">Languages:</span>
            {doctor.languages.map((lang, idx) => (
              <span key={idx} className="language-badge">{lang}</span>
            ))}
          </div>
        )}
      </div>

      {(showBookButton || doctor.consultationFee) && (
        <div className="doctor-card-footer">
          {doctor.consultationFee && (
            <div className="consultation-fee">
              <span className="fee-label">Consultation Fee</span>
              <span className="fee-amount">₹{doctor.consultationFee}</span>
            </div>
          )}
          {showBookButton && onBookAppointment && (
            <Button 
              icon={<Calendar size={18} />}
              onClick={() => onBookAppointment(doctor)}
            >
              Book Appointment
            </Button>
          )}
        </div>
      )}

      {showNextAvailable && doctor.nextAvailable && (
        <div className="next-available">
          Next Available: {new Date(doctor.nextAvailable).toLocaleDateString('en-IN', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      )}
    </Card>
  );
}

export default DoctorCard;
