package com.doctorai.controller;

import com.doctorai.dto.*;
import com.doctorai.service.DoctorPrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/prescriptions")
@Tag(name = "Doctor Prescription", description = "Doctor Prescription Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class DoctorPrescriptionController {

    @Autowired
    private DoctorPrescriptionService prescriptionService;

    // ==================== PATIENT SEARCH ====================

    @GetMapping("/patient/search")
    @Operation(summary = "Search patients", description = "Search patients by name, email, phone or patient ID")
    public ResponseEntity<ApiResponse<List<PatientSearchDTO>>> searchPatients(
            @RequestParam String query) {
        log.info("Searching patients with query: {}", query);
        List<PatientSearchDTO> patients = prescriptionService.searchPatients(query);
        return ResponseEntity.ok(ApiResponse.success("Patients found", patients));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get patient by ID", description = "Get patient details by patient ID")
    public ResponseEntity<ApiResponse<PatientSearchDTO>> getPatientById(
            @PathVariable String patientId) {
        log.info("Getting patient with ID: {}", patientId);
        PatientSearchDTO patient = prescriptionService.searchPatientById(patientId);
        return ResponseEntity.ok(ApiResponse.success("Patient found", patient));
    }

    // ==================== PATIENT HISTORY ====================

    @GetMapping("/patient/{patientId}/prescriptions")
    @Operation(summary = "Get patient prescriptions", description = "Get all prescriptions for a patient")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getPatientPrescriptions(
            @PathVariable String patientId) {
        log.info("Getting prescriptions for patient: {}", patientId);
        List<PrescriptionDTO> prescriptions = prescriptionService.getPatientPrescriptions(patientId);
        return ResponseEntity.ok(ApiResponse.success("Prescriptions retrieved", prescriptions));
    }

    @GetMapping("/patient/{patientId}/lab-reports")
    @Operation(summary = "Get patient lab reports", description = "Get all lab reports for a patient")
    public ResponseEntity<ApiResponse<List<LabReportDTO>>> getPatientLabReports(
            @PathVariable String patientId) {
        log.info("Getting lab reports for patient: {}", patientId);
        List<LabReportDTO> labReports = prescriptionService.getPatientLabReports(patientId);
        return ResponseEntity.ok(ApiResponse.success("Lab reports retrieved", labReports));
    }

    // ==================== PRESCRIPTION CRUD ====================

    @PostMapping
    @Operation(summary = "Create prescription", description = "Create a new prescription for a patient")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> createPrescription(
            @Valid @RequestBody CreatePrescriptionRequest request,
            Authentication authentication) {
        log.info("Creating prescription for patient: {} by doctor: {}", request.getPatientId(), authentication.getName());
        PrescriptionDTO prescription = prescriptionService.createPrescription(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Prescription created successfully", prescription));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get prescription by ID", description = "Get prescription details by database ID")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> getPrescriptionById(@PathVariable Long id) {
        log.info("Getting prescription with ID: {}", id);
        PrescriptionDTO prescription = prescriptionService.getPrescriptionById(id);
        return ResponseEntity.ok(ApiResponse.success("Prescription retrieved", prescription));
    }

    @GetMapping("/rx/{prescriptionId}")
    @Operation(summary = "Get prescription by prescription ID", description = "Get prescription details by prescription ID (RX-XXXX)")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> getPrescriptionByPrescriptionId(
            @PathVariable String prescriptionId) {
        log.info("Getting prescription with prescription ID: {}", prescriptionId);
        PrescriptionDTO prescription = prescriptionService.getPrescriptionByPrescriptionId(prescriptionId);
        return ResponseEntity.ok(ApiResponse.success("Prescription retrieved", prescription));
    }

    @GetMapping
    @Operation(summary = "Get doctor's prescriptions", description = "Get all prescriptions created by the logged-in doctor")
    public ResponseEntity<ApiResponse<List<PrescriptionDTO>>> getDoctorPrescriptions(Authentication authentication) {
        log.info("Getting prescriptions for doctor: {}", authentication.getName());
        List<PrescriptionDTO> prescriptions = prescriptionService.getDoctorPrescriptions(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Prescriptions retrieved", prescriptions));
    }

    @GetMapping("/count")
    @Operation(summary = "Get prescription count", description = "Get total prescription count for the logged-in doctor")
    public ResponseEntity<ApiResponse<Long>> getPrescriptionCount(Authentication authentication) {
        log.info("Getting prescription count for doctor: {}", authentication.getName());
        Long count = prescriptionService.getPrescriptionCount(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Prescription count retrieved", count));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update prescription", description = "Update an existing prescription")
    public ResponseEntity<ApiResponse<PrescriptionDTO>> updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody CreatePrescriptionRequest request,
            Authentication authentication) {
        log.info("Updating prescription ID: {} by doctor: {}", id, authentication.getName());
        PrescriptionDTO prescription = prescriptionService.updatePrescription(id, authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Prescription updated successfully", prescription));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete prescription", description = "Delete a prescription")
    public ResponseEntity<ApiResponse<Void>> deletePrescription(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Deleting prescription ID: {} by doctor: {}", id, authentication.getName());
        prescriptionService.deletePrescription(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully", null));
    }

    // ==================== LAB REPORT MANAGEMENT ====================

    @PostMapping("/lab-reports")
    @Operation(summary = "Create lab report", description = "Create a new lab report for a patient")
    public ResponseEntity<ApiResponse<LabReportDTO>> createLabReport(
            @Valid @RequestBody CreateLabReportRequest request,
            Authentication authentication) {
        log.info("Creating lab report for patient: {} by doctor: {} - test type: {}", 
                request.getPatientId(), authentication.getName(), request.getTestName());
        LabReportDTO labReport = prescriptionService.createLabReport(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Lab report created successfully", labReport));
    }

    @GetMapping("/lab-reports/{reportId}")
    @Operation(summary = "Get lab report by ID", description = "Get lab report details by report ID")
    public ResponseEntity<ApiResponse<LabReportDTO>> getLabReportById(@PathVariable Long reportId) {
        log.info("Getting lab report with ID: {}", reportId);
        LabReportDTO labReport = prescriptionService.getLabReportById(reportId);
        return ResponseEntity.ok(ApiResponse.success("Lab report retrieved", labReport));
    }
}
