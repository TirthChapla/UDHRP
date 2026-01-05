package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceptionistProfileDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    
    // Receptionist specific fields
    private String receptionistId;
    private String department;
    private String employeeId;
    private String shift;
    private String notes;
    
    // Doctor information
    private String doctorName;
    private String doctorEmail;
}
