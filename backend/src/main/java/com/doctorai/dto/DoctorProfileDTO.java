package com.doctorai.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class DoctorProfileDTO {
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
    
    // Doctor Information
    private String licenseNumber;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String about;
    private String hospital;
    private String department;
    private Double consultationFee;
    private Double rating;
    private Integer totalReviews;
    private Set<String> languages;
    private Boolean isAvailable;
    
    // Working hours
    private String workStartTime;
    private String workEndTime;
}
