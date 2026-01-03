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
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
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
}
