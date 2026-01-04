package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.DoctorProfileDTO;
import com.doctorai.dto.UpdateDoctorProfileRequest;
import com.doctorai.service.DoctorProfileService;
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
@RequestMapping("/doctor/profile")
@Tag(name = "Doctor Profile", description = "Doctor Profile Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class DoctorProfileController {
    
    @Autowired
    private DoctorProfileService doctorProfileService;
    
    @GetMapping
    @Operation(summary = "Get doctor profile", description = "Retrieve the current logged-in doctor's profile information")
    public ResponseEntity<ApiResponse<DoctorProfileDTO>> getDoctorProfile(Authentication authentication) {
        log.info("Fetching doctor profile for user: {}", authentication.getName());
        DoctorProfileDTO profile = doctorProfileService.getDoctorProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Doctor profile retrieved successfully", profile));
    }
    
    @PutMapping
    @Operation(summary = "Update doctor profile", description = "Update the current logged-in doctor's profile information")
    public ResponseEntity<ApiResponse<DoctorProfileDTO>> updateDoctorProfile(
            @Valid @RequestBody UpdateDoctorProfileRequest request,
            Authentication authentication) {
        log.info("Updating doctor profile for user: {}", authentication.getName());
        DoctorProfileDTO profile = doctorProfileService.updateDoctorProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Doctor profile updated successfully", profile));
    }
}
