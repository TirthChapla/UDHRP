package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.PrescriptionDTO;
import com.doctorai.service.PatientMedicalRecordsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient/medical-records")
@Tag(name = "Patient Medical Records", description = "APIs for patient prescriptions and lab reports")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class PatientMedicalRecordsController {

    @Autowired
    private PatientMedicalRecordsService medicalRecordsService;

    // ==================== PRESCRIPTIONS ====================

    @GetMapping("/prescriptions")
    @Operation(summary = "Get all prescriptions", description = "Retrieve all prescriptions for the logged-in patient")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getAllPrescriptions(Authentication authentication) {
        log.info("Fetching all prescriptions for patient: {}", authentication.getName());
        List<PrescriptionDTO> prescriptions = medicalRecordsService.getPatientPrescriptions(authentication.getName());
        log.info("Retrieved {} prescriptions for patient: {}", prescriptions.size(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Prescriptions retrieved successfully", prescriptions));
    }

    @GetMapping("/prescriptions/{id}")
    @Operation(summary = "Get prescription by ID", description = "Retrieve a specific prescription by its ID")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> getPrescriptionById(
            @Parameter(description = "Prescription ID") @PathVariable Long id,
            Authentication authentication) {
        log.info("Fetching prescription ID: {} for patient: {}", id, authentication.getName());
        PrescriptionDTO prescription = medicalRecordsService.getPrescriptionById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Prescription retrieved successfully", prescription));
    }

    @GetMapping("/prescriptions/doctors")
    @Operation(summary = "Get unique doctors from prescriptions", description = "Get list of unique doctors who have treated the patient")
    public ResponseEntity<ApiResponse<List<String>>> getDoctorsFromPrescriptions(Authentication authentication) {
        log.info("Fetching unique doctors from prescriptions for patient: {}", authentication.getName());
        List<String> doctors = medicalRecordsService.getDoctorsFromPrescriptions(authentication.getName());
        log.debug("Found {} unique doctors for patient: {}", doctors.size(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Doctors list retrieved successfully", doctors));
    }

    @GetMapping("/prescriptions/years")
    @Operation(summary = "Get years from prescriptions", description = "Get list of years with prescriptions")
    public ResponseEntity<ApiResponse<List<Integer>>> getYearsFromPrescriptions(Authentication authentication) {
        log.info("Fetching years from prescriptions for patient: {}", authentication.getName());
        List<Integer> years = medicalRecordsService.getYearsFromPrescriptions(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Years list retrieved successfully", years));
    }

    @GetMapping("/prescriptions/filter")
    @Operation(summary = "Filter prescriptions", description = "Filter prescriptions by search query, doctor, month, and year")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> filterPrescriptions(
            @Parameter(description = "Search query") @RequestParam(required = false) String search,
            @Parameter(description = "Doctor name filter") @RequestParam(required = false) String doctor,
            @Parameter(description = "Month filter (1-12)") @RequestParam(required = false) Integer month,
            @Parameter(description = "Year filter") @RequestParam(required = false) Integer year,
            Authentication authentication) {
        log.info("Filtering prescriptions for patient: {} with search: {}, doctor: {}, month: {}, year: {}", 
                authentication.getName(), search, doctor, month, year);
        List<PrescriptionDTO> prescriptions = medicalRecordsService.filterPrescriptions(
                authentication.getName(), search, doctor, month, year);
        log.info("Found {} prescriptions matching filter criteria", prescriptions.size());
        return ResponseEntity.ok(ApiResponse.success("Prescriptions filtered successfully", prescriptions));
    }
}
