package com.doctorai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "lab_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LabReport extends BaseEntity {
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    @Column(nullable = false)
    private String testName;
    
    @Column(nullable = false)
    private LocalDate testDate;
    
    @Column(length = 2000)
    private String results;
    
    private String reportFilePath;
    
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;
    
    private String laboratoryName;
    
    @Column(length = 1000)
    private String doctorNotes;
    
    public enum ReportStatus {
        PENDING, COMPLETED, REVIEWED
    }
}
