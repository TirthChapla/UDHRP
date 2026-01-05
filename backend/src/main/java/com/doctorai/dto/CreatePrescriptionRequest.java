package com.doctorai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePrescriptionRequest {
    
    @NotBlank(message = "Patient ID is required")
    private String patientId;
    
    private String diagnosis;
    
    private String symptoms;
    
    @NotNull(message = "At least one medication is required")
    private List<MedicationDTO> medications;
    
    private String instructions;
    
    private String dietToFollow;
    
    private String allergies;
    
    private String labReports;
    
    private String followUp;
    
    private String followUpDate;
    
    private String additionalNotes;
    
    private Long appointmentId;
}
