package com.doctorai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    private String phoneNumber;
    
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private String address;
    
    private String city;
    
    private String state;
    
    private String zipCode;
    
    private String profileImage;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    private Boolean emailVerified = false;
    
    private String resetToken;
    
    private LocalDateTime resetTokenExpiry;
    
    private String passwordResetOtp;
    
    private LocalDateTime otpExpiry;
    
    private String verificationToken;
    
    private LocalDateTime verificationTokenExpiry;
    
    public enum UserRole {
        PATIENT, DOCTOR, RECEPTIONIST, LABORATORY, INSURANCE, ADMIN
    }
    
    public enum Gender {
        MALE, FEMALE, OTHER
    }
}
