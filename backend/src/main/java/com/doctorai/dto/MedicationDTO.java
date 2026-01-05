package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationDTO {
    private Long id;
    private String drug;
    private String unit;
    private String dosage;
    private Integer duration;
    private String instructions;
    private String timing;
}
