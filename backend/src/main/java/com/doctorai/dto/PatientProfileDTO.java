package com.doctorai.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PatientProfileDTO {
    // User Information
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String profileImage;
    
    // Patient Information
    private String patientId;
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
    
    // Occupation and Contact
    private String occupation;
    private String cellNo;
    
    // Health Insurance Details
    private String healthInsuranceNo;
    private String healthCareProvider;
    private String healthCardNo;
    
    // Vital Signs
    private String bloodPressure;
    private Integer pulseRate;
    
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
