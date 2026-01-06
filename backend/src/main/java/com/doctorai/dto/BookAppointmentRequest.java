package com.doctorai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookAppointmentRequest {
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotBlank(message = "Appointment date is required")
    private String date; // Format: yyyy-MM-dd
    
    @NotBlank(message = "Appointment time is required")
    private String time; // Format: HH:mm or h:mm a
    
    private String type; // IN_PERSON, VIDEO_CALL, PHONE_CALL
    
    private String reason; // Reason for appointment
    
    private String notes; // Additional notes
}
