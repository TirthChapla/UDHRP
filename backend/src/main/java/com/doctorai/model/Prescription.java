package com.doctorai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Prescription extends BaseEntity {
    
    @Column(unique = true)
    private String prescriptionId;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @Column(nullable = false)
    private LocalDate prescriptionDate;
    
    @Column(length = 2000)
    private String diagnosis;
    
    @Column(length = 2000)
    private String symptoms;
    
    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Medication> medications = new ArrayList<>();
    
    @Column(length = 2000)
    private String instructions;
    
    @Column(length = 2000)
    private String dietToFollow;
    
    @Column(length = 500)
    private String allergies;
    
    @Column(length = 2000)
    private String labReports;
    
    @Column(length = 500)
    private String followUp;
    
    private LocalDate followUpDate;
    
    @Column(length = 2000)
    private String additionalNotes;
    
    // Helper method to add medication
    public void addMedication(Medication medication) {
        medications.add(medication);
        medication.setPrescription(this);
    }
    
    // Helper method to remove medication
    public void removeMedication(Medication medication) {
        medications.remove(medication);
        medication.setPrescription(null);
    }
}
