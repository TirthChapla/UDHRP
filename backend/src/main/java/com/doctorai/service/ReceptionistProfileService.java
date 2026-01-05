package com.doctorai.service;

import com.doctorai.dto.ReceptionistProfileDTO;
import com.doctorai.dto.UpdateReceptionistProfileRequest;
import com.doctorai.model.Receptionist;
import com.doctorai.model.User;
import com.doctorai.repository.ReceptionistRepository;
import com.doctorai.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@Slf4j
public class ReceptionistProfileService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReceptionistRepository receptionistRepository;
    
    @Transactional
    public ReceptionistProfileDTO getReceptionistProfile(String email) {
        log.info("Fetching receptionist profile for email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Find or create receptionist record
        Receptionist receptionist = receptionistRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    // Create new receptionist record if doesn't exist
                    Receptionist newReceptionist = new Receptionist();
                    newReceptionist.setUser(user);
                    newReceptionist.setReceptionistId("REC-" + user.getId());
                    return receptionistRepository.save(newReceptionist);
                });
        
        return mapToDTO(user, receptionist);
    }
    
    @Transactional
    public ReceptionistProfileDTO updateReceptionistProfile(String email, UpdateReceptionistProfileRequest request) {
        log.info("Updating receptionist profile for email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Update user fields (common fields)
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().trim().isEmpty()) {
            user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }
        
        if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
            user.setGender(User.Gender.valueOf(request.getGender().toUpperCase()));
        }
        
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        if (request.getState() != null) {
            user.setState(request.getState());
        }
        if (request.getZipCode() != null) {
            user.setZipCode(request.getZipCode());
        }
        
        User savedUser = userRepository.save(user);
        
        // Find or create receptionist record
        Receptionist receptionist = receptionistRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    Receptionist newReceptionist = new Receptionist();
                    newReceptionist.setUser(savedUser);
                    newReceptionist.setReceptionistId("REC-" + savedUser.getId());
                    return newReceptionist;
                });
        
        // Update receptionist-specific fields
        if (request.getDepartment() != null) {
            receptionist.setDepartment(request.getDepartment());
        }
        if (request.getEmployeeId() != null) {
            receptionist.setEmployeeId(request.getEmployeeId());
        }
        if (request.getShift() != null) {
            receptionist.setShift(request.getShift());
        }
        if (request.getNotes() != null) {
            receptionist.setNotes(request.getNotes());
        }
        if (request.getDoctorName() != null) {
            receptionist.setDoctorName(request.getDoctorName());
        }
        if (request.getDoctorEmail() != null) {
            receptionist.setDoctorEmail(request.getDoctorEmail());
        }
        
        Receptionist savedReceptionist = receptionistRepository.save(receptionist);
        
        log.info("Receptionist profile updated successfully for email: {}", email);
        return mapToDTO(savedUser, savedReceptionist);
    }
    
    private ReceptionistProfileDTO mapToDTO(User user, Receptionist receptionist) {
        return ReceptionistProfileDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .dateOfBirth(user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null)
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .receptionistId(receptionist.getReceptionistId())
                .department(receptionist.getDepartment())
                .employeeId(receptionist.getEmployeeId())
                .shift(receptionist.getShift())
                .notes(receptionist.getNotes())
                .doctorName(receptionist.getDoctorName())
                .doctorEmail(receptionist.getDoctorEmail())
                .build();
    }
}
