package com.doctorai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Doctor extends BaseEntity {
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, unique = true)
    private String licenseNumber;
    
    @Column(nullable = false)
    private String specialization;
    
    private String qualification;
    
    private Integer experienceYears;
    
    @Column(length = 1000)
    private String about;
    
    private String hospital;
    
    private String department;
    
    private Double consultationFee;
    
    private Double rating = 0.0;
    
    private Integer totalReviews = 0;
    
    @ElementCollection
    @CollectionTable(name = "doctor_languages", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "language")
    private Set<String> languages;
    
    @Column(nullable = false)
    private Boolean isAvailable = true;
}
