package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReceptionistProfileRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    
    // Receptionist specific fields
    private String department;
    private String employeeId;
    private String shift;
    private String notes;
    
    // Associated doctor fields
    private String doctorName;
    private String doctorEmail;
}
