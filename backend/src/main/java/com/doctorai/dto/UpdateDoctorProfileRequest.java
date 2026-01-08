package com.doctorai.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class UpdateDoctorProfileRequest {
    // User Information
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    
    // Doctor Information
    @NotBlank(message = "License number is required")
    private String licenseNumber;
    
    @NotBlank(message = "Specialization is required")
    private String specialization;
    
    private String qualification;
    private Integer experienceYears;
    private String about;
    private String hospital;
    private String department;
    private Double consultationFee;
    private Set<String> languages;
    private Boolean isAvailable;
    
    // Working hours
    private String workStartTime; // Format: HH:mm (e.g., "09:00")
    private String workEndTime; // Format: HH:mm (e.g., "17:00")
}
