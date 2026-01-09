package com.doctorai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLabReportRequest {
    
    @NotBlank(message = "Patient ID is required")
    private String patientId;
    
    @NotBlank(message = "Test name is required")
    private String testName;
    
    private String testDate;
    
    private String results;
    
    private String laboratoryName;
    
    private String doctorNotes;
    
    private String reportFilePath;
}
