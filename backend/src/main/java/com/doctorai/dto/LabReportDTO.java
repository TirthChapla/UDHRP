package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReportDTO {
    private Long id;
    private String reportId;
    private String date;
    private String testName;
    private String status;
    private String details;
    private String results;
    private String laboratoryName;
    private String doctorNotes;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String reportFilePath;
}
