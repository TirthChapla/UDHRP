package com.doctorai.service;

import com.doctorai.dto.DoctorSearchDTO;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.model.Doctor;
import com.doctorai.model.User;
import com.doctorai.repository.DoctorRepository;
import com.doctorai.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DoctorSearchService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all available doctors
     */
    public List<DoctorSearchDTO> getAllDoctors() {
        log.info("Fetching all doctors");
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all available doctors (only those with isAvailable = true)
     */
    public List<DoctorSearchDTO> getAvailableDoctors() {
        log.info("Fetching available doctors");
        List<Doctor> doctors = doctorRepository.findByIsAvailableTrue();
        return doctors.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search doctors by multiple filters
     */
    public List<DoctorSearchDTO> searchDoctors(String query, String specialization, String city) {
        log.info("Searching doctors with query: {}, specialization: {}, city: {}", query, specialization, city);
        
        List<Doctor> allDoctors = doctorRepository.findAll();
        
        return allDoctors.stream()
                .filter(doctor -> filterByQuery(doctor, query))
                .filter(doctor -> filterBySpecialization(doctor, specialization))
                .filter(doctor -> filterByCity(doctor, city))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get doctors by specialization
     */
    public List<DoctorSearchDTO> getDoctorsBySpecialization(String specialization) {
        log.info("Fetching doctors by specialization: {}", specialization);
        List<Doctor> doctors = doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
        return doctors.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get doctor by ID
     */
    public DoctorSearchDTO getDoctorById(Long doctorId) {
        log.info("Fetching doctor by ID: {}", doctorId);
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));
        return mapToDTO(doctor);
    }

    /**
     * Get list of available specializations
     */
    public List<String> getSpecializations() {
        log.info("Fetching all specializations");
        return doctorRepository.findDistinctSpecializations();
    }

    /**
     * Get list of available cities
     */
    public List<String> getCities() {
        log.info("Fetching all cities");
        return doctorRepository.findDistinctCities();
    }

    // Private helper methods

    private boolean filterByQuery(Doctor doctor, String query) {
        if (query == null || query.trim().isEmpty()) {
            return true;
        }
        String lowerQuery = query.toLowerCase().trim();
        User user = doctor.getUser();
        
        String fullName = (user.getFirstName() + " " + user.getLastName()).toLowerCase();
        String specialization = doctor.getSpecialization() != null ? doctor.getSpecialization().toLowerCase() : "";
        String hospital = doctor.getHospital() != null ? doctor.getHospital().toLowerCase() : "";
        
        return fullName.contains(lowerQuery) || 
               specialization.contains(lowerQuery) ||
               hospital.contains(lowerQuery);
    }

    private boolean filterBySpecialization(Doctor doctor, String specialization) {
        if (specialization == null || specialization.trim().isEmpty()) {
            return true;
        }
        return doctor.getSpecialization() != null && 
               doctor.getSpecialization().toLowerCase().contains(specialization.toLowerCase().trim());
    }

    private boolean filterByCity(Doctor doctor, String city) {
        if (city == null || city.trim().isEmpty()) {
            return true;
        }
        User user = doctor.getUser();
        return user.getCity() != null && 
               user.getCity().toLowerCase().contains(city.toLowerCase().trim());
    }

    private DoctorSearchDTO mapToDTO(Doctor doctor) {
        User user = doctor.getUser();
        
        // Build full address
        String fullAddress = buildFullAddress(user, doctor);
        
        // Calculate next available date (for now, set to tomorrow or next working day)
        LocalDate nextAvailable = calculateNextAvailable(doctor);
        
        // Build availability string from working hours
        String availability = buildAvailabilityString(doctor);
        
        return DoctorSearchDTO.builder()
                .id(doctor.getId())
                .name("Dr. " + user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperienceYears())
                .about(doctor.getAbout())
                .hospital(doctor.getHospital())
                .department(doctor.getDepartment())
                .consultationFee(doctor.getConsultationFee())
                .rating(doctor.getRating())
                .reviews(doctor.getTotalReviews())
                .languages(doctor.getLanguages())
                .isAvailable(doctor.getIsAvailable())
                .address(fullAddress)
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .availability(availability)
                .nextAvailable(nextAvailable)
                .profileImage(user.getProfileImage())
                .workStartTime(doctor.getWorkStartTime())
                .workEndTime(doctor.getWorkEndTime())
                .build();
    }
    
    private String buildAvailabilityString(Doctor doctor) {
        String startTime = doctor.getWorkStartTime();
        String endTime = doctor.getWorkEndTime();
        
        if (startTime != null && endTime != null) {
            return formatTime(startTime) + " - " + formatTime(endTime);
        }
        return "9:00 AM - 5:00 PM"; // Default
    }
    
    private String formatTime(String time24h) {
        try {
            String[] parts = time24h.split(":");
            int hour = Integer.parseInt(parts[0]);
            int minute = Integer.parseInt(parts[1]);
            String ampm = hour >= 12 ? "PM" : "AM";
            if (hour > 12) hour -= 12;
            if (hour == 0) hour = 12;
            return String.format("%d:%02d %s", hour, minute, ampm);
        } catch (Exception e) {
            return time24h;
        }
    }

    private String buildFullAddress(User user, Doctor doctor) {
        StringBuilder address = new StringBuilder();
        
        if (doctor.getHospital() != null && !doctor.getHospital().isEmpty()) {
            address.append(doctor.getHospital());
        }
        
        if (user.getAddress() != null && !user.getAddress().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(user.getAddress());
        }
        
        if (user.getCity() != null && !user.getCity().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(user.getCity());
        }
        
        return address.toString();
    }

    private LocalDate calculateNextAvailable(Doctor doctor) {
        // Simple logic - if doctor is available, next available is tomorrow
        // In a real application, this would check the doctor's schedule
        if (Boolean.TRUE.equals(doctor.getIsAvailable())) {
            LocalDate tomorrow = LocalDate.now().plusDays(1);
            // Skip weekends
            while (tomorrow.getDayOfWeek().getValue() > 5) {
                tomorrow = tomorrow.plusDays(1);
            }
            return tomorrow;
        }
        return null;
    }
}
