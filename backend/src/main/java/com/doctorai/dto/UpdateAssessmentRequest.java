package com.doctorai.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAssessmentRequest {

    @NotNull(message = "Assessment data is required")
    private Map<String, Object> data;
}
