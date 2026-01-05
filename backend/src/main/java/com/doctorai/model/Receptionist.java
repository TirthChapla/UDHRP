package com.doctorai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "receptionists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Receptionist extends BaseEntity {
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = true)
    private User doctor; // Optional: The doctor who authorized this receptionist
    
    @Column(unique = true)
    private String receptionistId;
    
    private String employeeId;
    
    private String department;
    
    private String shift; // Morning, Evening, Night
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private String doctorName;
    
    private String doctorEmail;
}
