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
public class PatientSearchDTO {
    private Long id;
    private String patientId;
    private String name;
    private String firstName;
    private String lastName;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String phone;
    private String email;
    private String address;
    private String allergies;
    private List<String> chronicConditions;
    private String profileImage;
}
