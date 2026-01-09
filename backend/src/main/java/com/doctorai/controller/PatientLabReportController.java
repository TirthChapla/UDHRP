package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.LabReportDTO;
import com.doctorai.service.PatientLabReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing patient lab reports
 * Handles endpoints related to lab reports linked to prescriptions
 */
@RestController
@RequestMapping("/patient/medical-records")
@Tag(name = "Patient Lab Reports", description = "Endpoints for managing patient lab reports")
@Slf4j
@SecurityRequirement(name = "bearer-jwt")
public class PatientLabReportController {

    @Autowired
    private PatientLabReportService patientLabReportService;

    /**
     * Get all lab reports for the logged-in patient
     *
     * @param authentication The authenticated user (to get email)
     * @return List of all lab reports for the patient
     */
    @GetMapping("/lab-reports")
    @Operation(summary = "Get all lab reports", 
               description = "Retrieves all lab reports for the logged-in patient")
    public ResponseEntity<ApiResponse<List<LabReportDTO>>> getAllLabReports(
            Authentication authentication) {
        
        log.info("Fetching all lab reports for patient: {}", authentication.getName());
        
        try {
            String email = authentication.getName();
            List<LabReportDTO> labReports = patientLabReportService.getPatientLabReports(email);
            
            return ResponseEntity.ok(
                    ApiResponse.success("Lab reports retrieved successfully", labReports)
            );
        } catch (Exception ex) {
            log.error("Error fetching lab reports for patient: {}", authentication.getName(), ex);
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Error retrieving lab reports: " + ex.getMessage())
            );
        }
    }

    /**
     * Get lab reports for a specific prescription
     *
     * @param prescriptionId The ID of the prescription
     * @param authentication The authenticated user (to get email)
     * @return List of lab reports linked to the prescription
     */
    @GetMapping("/prescriptions/{id}/lab-reports")
    @Operation(summary = "Get lab reports for a prescription", 
               description = "Retrieves all lab reports linked to a specific prescription")
    public ResponseEntity<ApiResponse<List<LabReportDTO>>> getLabReportsForPrescription(
            @PathVariable("id") Long prescriptionId,
            Authentication authentication) {
        
        log.info("Fetching lab reports for prescription: {}", prescriptionId);
        
        try {
            String email = authentication.getName();
            List<LabReportDTO> labReports = patientLabReportService.getLabReportsForPrescription(prescriptionId, email);
            
            return ResponseEntity.ok(
                    ApiResponse.success("Lab reports retrieved successfully", labReports)
            );
        } catch (Exception ex) {
            log.error("Error fetching lab reports for prescription: {}", prescriptionId, ex);
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Error retrieving lab reports: " + ex.getMessage())
            );
        }
    }
}
