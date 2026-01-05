package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long id;
    private String time;
    private String date;
    private String patientName;
    private String patientId;
    private String patientEmail;
    private String patientPhone;
    private String type;
    private String status;
    private String reason;
    private String notes;
    private String meetingLink;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
}
