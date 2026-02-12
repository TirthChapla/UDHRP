package com.doctorai.dto;

import com.doctorai.model.AssessmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentDTO {
    private Long id;
    private AssessmentType type;
    private String patientId;
    private Long prescriptionId;
    private Map<String, Object> data;
    private String createdAt;
}
