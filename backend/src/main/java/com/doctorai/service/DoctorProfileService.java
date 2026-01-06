package com.doctorai.service;

import com.doctorai.dto.DoctorProfileDTO;
import com.doctorai.dto.UpdateDoctorProfileRequest;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.model.Doctor;
import com.doctorai.model.User;
import com.doctorai.repository.DoctorRepository;
import com.doctorai.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@Slf4j
public class DoctorProfileService {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get doctor profile by user email
     */
    public DoctorProfileDTO getDoctorProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElse(null);
        
        return mapToDTO(user, doctor);
    }
    
    /**
     * Update doctor profile
     */
    @Transactional
    public DoctorProfileDTO updateDoctorProfile(String email, UpdateDoctorProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        // Update user information
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
            user.setGender(User.Gender.valueOf(request.getGender().toUpperCase()));
        }
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setZipCode(request.getZipCode());
        userRepository.save(user);
        
        // Get or create doctor record
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElse(new Doctor());
        
        if (doctor.getId() == null) {
            doctor.setUser(user);
        }
        
        // Update doctor information
        updateDoctorFields(doctor, request);
        doctorRepository.save(doctor);
        
        log.info("Doctor profile updated successfully for user: {}", email);
        return mapToDTO(user, doctor);
    }
    
    /**
     * Update doctor fields from request
     */
    private void updateDoctorFields(Doctor doctor, UpdateDoctorProfileRequest request) {
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setAbout(request.getAbout());
        doctor.setHospital(request.getHospital());
        doctor.setDepartment(request.getDepartment());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);
        
        // Working hours
        doctor.setWorkStartTime(request.getWorkStartTime());
        doctor.setWorkEndTime(request.getWorkEndTime());
        
        // Languages - filter out empty strings
        if (request.getLanguages() != null) {
            doctor.setLanguages(new HashSet<>(request.getLanguages()));
        } else {
            doctor.setLanguages(new HashSet<>());
        }
    }
    
    /**
     * Map User and Doctor entities to DoctorProfileDTO
     */
    private DoctorProfileDTO mapToDTO(User user, Doctor doctor) {
        DoctorProfileDTO dto = new DoctorProfileDTO();
        
        // User information
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender() != null ? user.getGender().toString() : null);
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setZipCode(user.getZipCode());
        dto.setProfileImage(user.getProfileImage());
        
        // Doctor information (if exists)
        if (doctor != null && doctor.getId() != null) {
            dto.setLicenseNumber(doctor.getLicenseNumber());
            dto.setSpecialization(doctor.getSpecialization());
            dto.setQualification(doctor.getQualification());
            dto.setExperienceYears(doctor.getExperienceYears());
            dto.setAbout(doctor.getAbout());
            dto.setHospital(doctor.getHospital());
            dto.setDepartment(doctor.getDepartment());
            dto.setConsultationFee(doctor.getConsultationFee());
            dto.setRating(doctor.getRating());
            dto.setTotalReviews(doctor.getTotalReviews());
            dto.setLanguages(doctor.getLanguages());
            dto.setIsAvailable(doctor.getIsAvailable());
            dto.setWorkStartTime(doctor.getWorkStartTime());
            dto.setWorkEndTime(doctor.getWorkEndTime());
        } else {
            // Set default values if doctor record doesn't exist
            dto.setIsAvailable(true);
            dto.setRating(0.0);
            dto.setTotalReviews(0);
            dto.setLanguages(new HashSet<>());
            dto.setWorkStartTime("09:00");
            dto.setWorkEndTime("17:00");
        }
        
        return dto;
    }
}
