package com.doctorai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = "prescription")
public class Medication extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;
    
    @Column(nullable = false)
    private String drug; // medicineName
    
    private String unit; // e.g., "500mg", "10ml"
    
    @Column(nullable = false)
    private String dosage; // e.g., "Twice daily after meals"
    
    private Integer duration; // in days
    
    @Column(length = 500)
    private String instructions;
    
    private String timing; // e.g., "Before meals", "After meals"
}
