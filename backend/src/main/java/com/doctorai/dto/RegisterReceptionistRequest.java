package com.doctorai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterReceptionistRequest {
    // Doctor verification
    @NotBlank(message = "Doctor email is required")
    @Email(message = "Invalid doctor email format")
    private String doctorEmail;
    
    @NotBlank(message = "Doctor password is required")
    private String doctorPassword;
    
    // Receptionist details
    @NotBlank(message = "Receptionist name is required")
    private String receptionistName;
    
    @NotBlank(message = "Receptionist email is required")
    @Email(message = "Invalid receptionist email format")
    private String receptionistEmail;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String receptionistPassword;
    
    private String receptionistPhone;
}
