package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionDTO {
    private Long id;
    private String prescriptionId;
    private String date;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String patientId;
    private String patientName;
    private String diagnosis;
    private String symptoms;
    private List<MedicationDTO> medications;
    private String instructions;
    private String dietToFollow;
    private String allergies;
    private String labReports;
    private String followUp;
    private String followUpDate;
    private String additionalNotes;
    private String createdAt;
}
