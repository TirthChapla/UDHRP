package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.PatientProfileDTO;
import com.doctorai.dto.UpdatePatientProfileRequest;
import com.doctorai.service.PatientProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patient/profile")
@Tag(name = "Patient Profile", description = "Patient Profile Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class PatientProfileController {
    
    @Autowired
    private PatientProfileService patientProfileService;
    
    @GetMapping
    @Operation(summary = "Get patient profile", description = "Retrieve the current logged-in patient's profile information")
    public ResponseEntity<ApiResponse<PatientProfileDTO>> getPatientProfile(Authentication authentication) {
        log.info("Fetching patient profile for user: {}", authentication.getName());
        PatientProfileDTO profile = patientProfileService.getPatientProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Patient profile retrieved successfully", profile));
    }
    
    @PutMapping
    @Operation(summary = "Update patient profile", description = "Update the current logged-in patient's profile information")
    public ResponseEntity<ApiResponse<PatientProfileDTO>> updatePatientProfile(
            @Valid @RequestBody UpdatePatientProfileRequest request,
            Authentication authentication) {
        log.info("Updating patient profile for user: {}", authentication.getName());
        PatientProfileDTO profile = patientProfileService.updatePatientProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Patient profile updated successfully", profile));
    }
}
