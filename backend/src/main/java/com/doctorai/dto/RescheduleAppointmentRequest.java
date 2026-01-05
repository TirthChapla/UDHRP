package com.doctorai.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RescheduleAppointmentRequest {
    
    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;
    
    @NotNull(message = "New date is required")
    private String date;
    
    @NotNull(message = "New time is required")
    private String time;
    
    private String reason;
}
