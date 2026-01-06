package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.DoctorSearchDTO;
import com.doctorai.service.DoctorSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient/doctors")
@Tag(name = "Patient - Find Doctor", description = "APIs for patients to search and find doctors")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class PatientDoctorSearchController {

    @Autowired
    private DoctorSearchService doctorSearchService;

    @GetMapping
    @Operation(summary = "Get all doctors", description = "Retrieve list of all registered doctors")
    public ResponseEntity<ApiResponse<List<DoctorSearchDTO>>> getAllDoctors() {
        log.info("Patient requesting all doctors list");
        List<DoctorSearchDTO> doctors = doctorSearchService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved successfully", doctors));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available doctors", description = "Retrieve list of available doctors")
    public ResponseEntity<ApiResponse<List<DoctorSearchDTO>>> getAvailableDoctors() {
        log.info("Patient requesting available doctors list");
        List<DoctorSearchDTO> doctors = doctorSearchService.getAvailableDoctors();
        return ResponseEntity.ok(ApiResponse.success("Available doctors retrieved successfully", doctors));
    }

    @GetMapping("/search")
    @Operation(summary = "Search doctors", description = "Search doctors by name, specialization, or city")
    public ResponseEntity<ApiResponse<List<DoctorSearchDTO>>> searchDoctors(
            @Parameter(description = "Search query (name, specialization, or hospital)")
            @RequestParam(required = false) String query,
            @Parameter(description = "Filter by specialization")
            @RequestParam(required = false) String specialization,
            @Parameter(description = "Filter by city")
            @RequestParam(required = false) String city) {
        log.info("Patient searching doctors with query: {}, specialization: {}, city: {}", query, specialization, city);
        List<DoctorSearchDTO> doctors = doctorSearchService.searchDoctors(query, specialization, city);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", doctors));
    }

    @GetMapping("/specialization/{specialization}")
    @Operation(summary = "Get doctors by specialization", description = "Retrieve doctors filtered by specialization")
    public ResponseEntity<ApiResponse<List<DoctorSearchDTO>>> getDoctorsBySpecialization(
            @Parameter(description = "Specialization name")
            @PathVariable String specialization) {
        log.info("Patient requesting doctors by specialization: {}", specialization);
        List<DoctorSearchDTO> doctors = doctorSearchService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved successfully", doctors));
    }

    @GetMapping("/{doctorId}")
    @Operation(summary = "Get doctor details", description = "Retrieve detailed information about a specific doctor")
    public ResponseEntity<ApiResponse<DoctorSearchDTO>> getDoctorById(
            @Parameter(description = "Doctor ID")
            @PathVariable Long doctorId) {
        log.info("Patient requesting doctor details for ID: {}", doctorId);
        DoctorSearchDTO doctor = doctorSearchService.getDoctorById(doctorId);
        return ResponseEntity.ok(ApiResponse.success("Doctor details retrieved successfully", doctor));
    }

    @GetMapping("/specializations")
    @Operation(summary = "Get all specializations", description = "Retrieve list of all available specializations")
    public ResponseEntity<ApiResponse<List<String>>> getSpecializations() {
        log.info("Patient requesting specializations list");
        List<String> specializations = doctorSearchService.getSpecializations();
        return ResponseEntity.ok(ApiResponse.success("Specializations retrieved successfully", specializations));
    }

    @GetMapping("/cities")
    @Operation(summary = "Get all cities", description = "Retrieve list of all cities where doctors are available")
    public ResponseEntity<ApiResponse<List<String>>> getCities() {
        log.info("Patient requesting cities list");
        List<String> cities = doctorSearchService.getCities();
        return ResponseEntity.ok(ApiResponse.success("Cities retrieved successfully", cities));
    }
}
