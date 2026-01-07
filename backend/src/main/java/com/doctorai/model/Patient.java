package com.doctorai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Patient extends BaseEntity {
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(unique = true)
    private String patientId;
    
    private String bloodGroup;
    
    private Double height; // in cm
    
    private Double weight; // in kg
    
    @Column(length = 2000)
    private String allergies;
    
    @Column(length = 2000)
    private String chronicDiseases;
    
    @Column(length = 2000)
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
    private String bloodPressure; // Format: "120/80"
    
    private Integer pulseRate; // bpm
    
    // New fields from Patient Profile
    private Boolean isAlive = true;
    
    @Column(length = 500)
    private String deathReason;
    
    private String motherHealthId;
    
    private String fatherHealthId;
    
    @Column(length = 1000)
    private String parentsAllergies;
    
    private Boolean hasNoParentInfo = false;
    
    private String birthPlace;
    
    private String hospitalName;
    
    @Column(length = 2000)
    private String specificInstructions;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "patient_siblings", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "sibling_health_id")
    private java.util.List<String> siblings = new java.util.ArrayList<>();
}
