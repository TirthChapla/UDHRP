import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

function PrescriptionFilters({ 
  searchQuery,
  onSearchChange,
  selectedDoctor,
  onDoctorChange,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  doctorsList,
  yearsList,
  onClearFilters
}) {
  const hasActiveFilters = searchQuery || selectedDoctor !== 'all' || 
                          selectedMonth !== 'all' || selectedYear !== 'all';

  return (
    <Card className="filters-card">
      <div className="filters-container">
        <div className="search-box-prescription">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by doctor name or diagnosis..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input-prescription"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>
              <Filter size={16} />
              Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => onDoctorChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Doctors</option>
              {doctorsList.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Calendar size={16} />
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Months</option>
              {MONTHS.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Calendar size={16} />
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Years</option>
              {yearsList.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="small"
              onClick={onClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default PrescriptionFilters;
