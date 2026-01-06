package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSearchDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String specialization;
    private String qualification;
    private Integer experience;
    private String about;
    private String hospital;
    private String department;
    private Double consultationFee;
    private Double rating;
    private Integer reviews;
    private Set<String> languages;
    private Boolean isAvailable;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String availability;
    private LocalDate nextAvailable;
    private String profileImage;
    private String workStartTime;
    private String workEndTime;
}
