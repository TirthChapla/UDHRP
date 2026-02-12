package com.doctorai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAssessmentRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotNull(message = "Prescription ID is required")
    private Long prescriptionId;

    @NotNull(message = "Assessment data is required")
    private Map<String, Object> data;
}
