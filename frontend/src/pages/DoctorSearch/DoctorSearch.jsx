import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Stethoscope,
  Filter,
  X,
  Loader2
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DoctorCard from '../../components/DoctorCard/DoctorCard';
import { searchDoctors, getSpecializations, getCities, getAllDoctors } from '../../services/patientService';
import './DoctorSearch.css';

function DoctorSearch({ onBookAppointment, initialSearchQuery }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tempCity, setTempCity] = useState('');
  const [tempSpecialization, setTempSpecialization] = useState('');
  
  // API states
  const [doctors, setDoctors] = useState([]);
  const [cities, setCities] = useState([{ value: '', label: 'All Cities' }]);
  const [specializations, setSpecializations] = useState([{ value: '', label: 'All Specializations' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data (all doctors, cities, specializations)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [doctorsData, citiesData, specializationsData] = await Promise.all([
          getAllDoctors(),
          getCities(),
          getSpecializations()
        ]);
        
        setDoctors(doctorsData || []);
        
        // Format cities for Select component
        const formattedCities = [
          { value: '', label: 'All Cities' },
          ...(citiesData || []).map(city => ({ value: city.toLowerCase(), label: city }))
        ];
        setCities(formattedCities);
        
        // Format specializations for Select component
        const formattedSpecializations = [
          { value: '', label: 'All Specializations' },
          ...(specializationsData || []).map(spec => ({ value: spec.toLowerCase(), label: spec }))
        ];
        setSpecializations(formattedSpecializations);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Set initial search query if provided
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Debounced search effect
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery || selectedCity || selectedSpecialization) {
        setLoading(true);
        try {
          const results = await searchDoctors({
            query: searchQuery || undefined,
            city: selectedCity || undefined,
            specialization: selectedSpecialization || undefined
          });
          setDoctors(results || []);
        } catch (err) {
          console.error('Error searching doctors:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // If no filters, fetch all doctors
        try {
          const allDoctors = await getAllDoctors();
          setDoctors(allDoctors || []);
        } catch (err) {
          console.error('Error fetching all doctors:', err);
        }
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, selectedCity, selectedSpecialization]);

  const handleClearFilters = async () => {
    setSelectedCity('');
    setSelectedSpecialization('');
    setSearchQuery('');
    setTempCity('');
    setTempSpecialization('');
  };

  const handleApplyFilters = () => {
    setSelectedCity(tempCity);
    setSelectedSpecialization(tempSpecialization);
    setShowFilters(false);
  };

  const handleOpenFilters = () => {
    setTempCity(selectedCity);
    setTempSpecialization(selectedSpecialization);
    setShowFilters(true);
  };

  const hasActiveFilters = selectedCity || selectedSpecialization || searchQuery;

  const handleBookAppointment = (doctor) => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  // Show loading state
  if (loading && doctors.length === 0) {
    return (
      <div className="doctor-search">
        <div className="search-header">
          <h1 className="search-title">Find Your Doctor</h1>
          <p className="search-subtitle">Search by name, specialization, or location</p>
        </div>
        <Card className="loading-card">
          <div className="loading-content">
            <Loader2 className="loading-spinner" size={48} />
            <p>Loading doctors...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error && doctors.length === 0) {
    return (
      <div className="doctor-search">
        <div className="search-header">
          <h1 className="search-title">Find Your Doctor</h1>
          <p className="search-subtitle">Search by name, specialization, or location</p>
        </div>
        <Card className="error-card">
          <div className="error-content">
            <X size={48} />
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

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
            onClick={handleOpenFilters}
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
          <>
            <div className="filters-overlay" onClick={() => setShowFilters(false)}></div>
            <div className="filters-section">
              <div className="filters-header">
                <h3>Filter Doctors</h3>
                <button className="filters-close" onClick={() => setShowFilters(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="filters-content">
                <Select
                  label="City"
                  options={cities}
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  name="city"
                />
                <Select
                  label="Specialization"
                  options={specializations}
                  value={tempSpecialization}
                  onChange={(e) => setTempSpecialization(e.target.value)}
                  name="specialization"
                />
              </div>
              <div className="filters-actions">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTempCity('');
                    setTempSpecialization('');
                  }}
                >
                  Clear
                </Button>
                <Button onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="results-count">
          {loading ? (
            <span className="loading-text">Searching...</span>
          ) : (
            <>Found {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'}</>
          )}
        </div>
      </Card>

      <div className="doctors-grid">
        {doctors.map(doctor => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor}
            onBookAppointment={handleBookAppointment}
          />
        ))}
      </div>

      {!loading && doctors.length === 0 && (
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
