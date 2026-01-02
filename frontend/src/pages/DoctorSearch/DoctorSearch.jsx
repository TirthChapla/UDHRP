import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Stethoscope,
  Filter,
  X
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DoctorCard from '../../components/DoctorCard/DoctorCard';
import './DoctorSearch.css';

function DoctorSearch({ onBookAppointment, initialSearchQuery }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Set initial search query if provided
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const cities = [
    { value: '', label: 'All Cities' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'pune', label: 'Pune' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'chennai', label: 'Chennai' }
  ];

  const specializations = [
    { value: '', label: 'All Specializations' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'general', label: 'General Physician' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'gynecology', label: 'Gynecology' },
    { value: 'psychiatry', label: 'Psychiatry' }
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Patel',
      specialization: 'Cardiology',
      experience: 15,
      qualification: 'MBBS, MD (Cardiology)',
      rating: 4.8,
      reviews: 245,
      address: 'Apollo Hospital, Andheri West, Mumbai',
      city: 'mumbai',
      availability: '10:00 AM - 5:00 PM',
      consultationFee: 1500,
      phone: '+91 98765 43210',
      email: 'dr.sarah.patel@apollo.com',
      languages: ['English', 'Hindi', 'Gujarati'],
      nextAvailable: '2025-12-28'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialization: 'General Physician',
      experience: 12,
      qualification: 'MBBS, MD (Internal Medicine)',
      rating: 4.6,
      reviews: 189,
      address: 'Fortis Clinic, Andheri East, Mumbai',
      city: 'mumbai',
      availability: '9:00 AM - 2:00 PM, 5:00 PM - 8:00 PM',
      consultationFee: 800,
      phone: '+91 98765 43211',
      email: 'dr.rajesh@fortis.com',
      languages: ['English', 'Hindi'],
      nextAvailable: '2025-12-26'
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      specialization: 'Dermatology',
      experience: 10,
      qualification: 'MBBS, MD (Dermatology)',
      rating: 4.9,
      reviews: 312,
      address: 'Max Hospital, Saket, Delhi',
      city: 'delhi',
      availability: '11:00 AM - 6:00 PM',
      consultationFee: 1200,
      phone: '+91 98765 43212',
      email: 'dr.priya.sharma@max.com',
      languages: ['English', 'Hindi', 'Punjabi'],
      nextAvailable: '2025-12-27'
    },
    {
      id: 4,
      name: 'Dr. Amit Verma',
      specialization: 'Pediatrics',
      experience: 18,
      qualification: 'MBBS, MD (Pediatrics)',
      rating: 4.7,
      reviews: 276,
      address: 'Manipal Hospital, Whitefield, Bangalore',
      city: 'bangalore',
      availability: '8:00 AM - 1:00 PM',
      consultationFee: 1000,
      phone: '+91 98765 43213',
      email: 'dr.amit.verma@manipal.com',
      languages: ['English', 'Hindi', 'Kannada'],
      nextAvailable: '2025-12-25'
    },
    {
      id: 5,
      name: 'Dr. Meera Singh',
      specialization: 'Orthopedics',
      experience: 14,
      qualification: 'MBBS, MS (Orthopedics)',
      rating: 4.8,
      reviews: 198,
      address: 'Kokilaben Hospital, Andheri, Mumbai',
      city: 'mumbai',
      availability: '10:00 AM - 4:00 PM',
      consultationFee: 1800,
      phone: '+91 98765 43214',
      email: 'dr.meera.singh@kokilaben.com',
      languages: ['English', 'Hindi', 'Marathi'],
      nextAvailable: '2025-12-29'
    },
    {
      id: 6,
      name: 'Dr. Vikram Reddy',
      specialization: 'Neurology',
      experience: 20,
      qualification: 'MBBS, DM (Neurology)',
      rating: 4.9,
      reviews: 342,
      address: 'Care Hospital, Banjara Hills, Hyderabad',
      city: 'hyderabad',
      availability: '9:00 AM - 3:00 PM',
      consultationFee: 2000,
      phone: '+91 98765 43215',
      email: 'dr.vikram.reddy@care.com',
      languages: ['English', 'Hindi', 'Telugu'],
      nextAvailable: '2025-12-30'
    }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = !searchQuery || 
                         doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || doctor.city === selectedCity;
    const matchesSpecialization = !selectedSpecialization || 
                                  doctor.specialization.toLowerCase() === selectedSpecialization.toLowerCase();
    
    return matchesSearch && matchesCity && matchesSpecialization;
  });

  const handleClearFilters = () => {
    setSelectedCity('');
    setSelectedSpecialization('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCity || selectedSpecialization || searchQuery;

  const handleBookAppointment = (doctor) => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  return (
    <div className="doctor-search">
      <div className="search-header">
        <h1 className="search-title">Find Your Doctor</h1>
        <p className="search-subtitle">Search by name, specialization, or location</p>
      </div>

      <Card className="search-filters-card">
        <div className="search-bar">
          <Input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={20} />}
          />
          <Button 
            variant="outline" 
            icon={<Filter size={20} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>          {hasActiveFilters && (
            <Button
              variant="outline"
              icon={<X size={20} />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}        </div>

        {showFilters && (
          <div className="filters-section">
            <Select
              label="City"
              options={cities}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              name="city"
            />
            <Select
              label="Specialization"
              options={specializations}
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              name="specialization"
            />
          </div>
        )}

        <div className="results-count">
          Found {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
        </div>
      </Card>

      <div className="doctors-grid">
        {filteredDoctors.map(doctor => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor}
            onBookAppointment={handleBookAppointment}
          />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="no-results">
          <Stethoscope size={64} />
          <h3>No doctors found</h3>
          <p>Try adjusting your search filters</p>
        </Card>
      )}
    </div>
  );
}

export default DoctorSearch;
