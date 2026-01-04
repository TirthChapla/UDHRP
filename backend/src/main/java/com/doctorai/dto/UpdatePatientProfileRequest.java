package com.doctorai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdatePatientProfileRequest {
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
    
    // Patient Information
    private Boolean isAlive;
    private String deathReason;
    private String bloodGroup;
    private Double height;
    private Double weight;
    private String allergies;
    private String chronicDiseases;
    private String emergencyContact;
    private String insuranceProvider;
    private String insuranceNumber;
    
    // Birth Information
    private String birthPlace;
    private String hospitalName;
    private String specificInstructions;
    
    // Family Information
    private String motherHealthId;
    private String fatherHealthId;
    private String parentsAllergies;
    private Boolean hasNoParentInfo;
    private List<String> siblings;
}
