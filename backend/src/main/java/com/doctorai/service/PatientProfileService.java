package com.doctorai.service;

import com.doctorai.dto.PatientProfileDTO;
import com.doctorai.dto.UpdatePatientProfileRequest;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.model.Patient;
import com.doctorai.model.User;
import com.doctorai.repository.PatientRepository;
import com.doctorai.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PatientProfileService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get patient profile by user email
     */
    public PatientProfileDTO getPatientProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElse(null);
        
        return mapToDTO(user, patient);
    }
    
    /**
     * Update patient profile
     */
    @Transactional
    public PatientProfileDTO updatePatientProfile(String email, UpdatePatientProfileRequest request) {
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
        
        // Get or create patient record
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElse(new Patient());
        
        if (patient.getId() == null) {
            patient.setUser(user);
            // Generate unique patient ID if not exists
            patient.setPatientId(generatePatientId());
        }
        
        // Update patient information
        updatePatientFields(patient, request);
        patientRepository.save(patient);
        
        log.info("Patient profile updated successfully for user: {}", email);
        return mapToDTO(user, patient);
    }
    
    /**
     * Generate unique patient ID
     */
    private String generatePatientId() {
        String candidate;
        do {
            candidate = "PAT-" + UUID.randomUUID().toString().substring(0, 9).toUpperCase();
            String finalCandidate = candidate;
            if (patientRepository.findAll().stream()
                    .noneMatch(p -> finalCandidate.equals(p.getPatientId()))) {
                break;
            }
        } while (true);
        return candidate;
    }
    
    /**
     * Update patient fields from request
     */
    private void updatePatientFields(Patient patient, UpdatePatientProfileRequest request) {
        patient.setIsAlive(request.getIsAlive() != null ? request.getIsAlive() : true);
        patient.setDeathReason(request.getDeathReason());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setHeight(request.getHeight());
        patient.setWeight(request.getWeight());
        patient.setAllergies(request.getAllergies());
        patient.setChronicDiseases(request.getChronicDiseases());
        patient.setEmergencyContact(request.getEmergencyContact());
        patient.setInsuranceProvider(request.getInsuranceProvider());
        patient.setInsuranceNumber(request.getInsuranceNumber());
        
        // Birth information
        patient.setBirthPlace(request.getBirthPlace());
        patient.setHospitalName(request.getHospitalName());
        patient.setSpecificInstructions(request.getSpecificInstructions());
        
        // Family information
        patient.setMotherHealthId(request.getMotherHealthId());
        patient.setFatherHealthId(request.getFatherHealthId());
        patient.setParentsAllergies(request.getParentsAllergies());
        patient.setHasNoParentInfo(request.getHasNoParentInfo() != null ? request.getHasNoParentInfo() : false);
        
        // Siblings - filter out empty strings
        if (request.getSiblings() != null) {
            patient.setSiblings(new ArrayList<>(request.getSiblings().stream()
                    .filter(s -> s != null && !s.trim().isEmpty())
                    .collect(Collectors.toList())));
        } else {
            patient.setSiblings(new ArrayList<>());
        }
    }
    
    /**
     * Map User and Patient entities to PatientProfileDTO
     */
    private PatientProfileDTO mapToDTO(User user, Patient patient) {
        PatientProfileDTO dto = new PatientProfileDTO();
        
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
        
        // Patient information (if exists)
        if (patient != null && patient.getId() != null) {
            dto.setPatientId(patient.getPatientId());
            dto.setIsAlive(patient.getIsAlive());
            dto.setDeathReason(patient.getDeathReason());
            dto.setBloodGroup(patient.getBloodGroup());
            dto.setHeight(patient.getHeight());
            dto.setWeight(patient.getWeight());
            dto.setAllergies(patient.getAllergies());
            dto.setChronicDiseases(patient.getChronicDiseases());
            dto.setEmergencyContact(patient.getEmergencyContact());
            dto.setInsuranceProvider(patient.getInsuranceProvider());
            dto.setInsuranceNumber(patient.getInsuranceNumber());
            
            // Birth information
            dto.setBirthPlace(patient.getBirthPlace());
            dto.setHospitalName(patient.getHospitalName());
            dto.setSpecificInstructions(patient.getSpecificInstructions());
            
            // Family information
            dto.setMotherHealthId(patient.getMotherHealthId());
            dto.setFatherHealthId(patient.getFatherHealthId());
            dto.setParentsAllergies(patient.getParentsAllergies());
            dto.setHasNoParentInfo(patient.getHasNoParentInfo());
            dto.setSiblings(patient.getSiblings());
        } else {
            // Set default values if patient record doesn't exist
            dto.setIsAlive(true);
            dto.setHasNoParentInfo(false);
            dto.setSiblings(new ArrayList<>());
        }
        
        return dto;
    }
}
