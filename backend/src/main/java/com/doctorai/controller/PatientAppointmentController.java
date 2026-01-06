package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.AppointmentDTO;
import com.doctorai.dto.BookAppointmentRequest;
import com.doctorai.service.PatientAppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient/appointments")
@Tag(name = "Patient Appointments", description = "Patient Appointment Booking and Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class PatientAppointmentController {

    @Autowired
    private PatientAppointmentService appointmentService;

    @PostMapping("/book")
    @Operation(summary = "Book an appointment", description = "Book a new appointment with a doctor")
    public ResponseEntity<ApiResponse<AppointmentDTO>> bookAppointment(
            @Valid @RequestBody BookAppointmentRequest request,
            Authentication authentication) {
        log.info("Patient {} booking appointment with doctor ID: {}", authentication.getName(), request.getDoctorId());
        try {
            AppointmentDTO appointment = appointmentService.bookAppointment(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Appointment booked successfully", appointment));
        } catch (RuntimeException e) {
            log.error("Error booking appointment: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Get all appointments", description = "Get all appointments for the logged-in patient")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAllAppointments(Authentication authentication) {
        log.info("Patient {} fetching all appointments", authentication.getName());
        List<AppointmentDTO> appointments = appointmentService.getPatientAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved successfully", appointments));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming appointments", description = "Get upcoming appointments for the logged-in patient")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getUpcomingAppointments(Authentication authentication) {
        log.info("Patient {} fetching upcoming appointments", authentication.getName());
        List<AppointmentDTO> appointments = appointmentService.getUpcomingAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Upcoming appointments retrieved successfully", appointments));
    }

    @GetMapping("/{appointmentId}")
    @Operation(summary = "Get appointment by ID", description = "Get details of a specific appointment")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getAppointmentById(
            @Parameter(description = "Appointment ID") @PathVariable Long appointmentId,
            Authentication authentication) {
        log.info("Patient {} fetching appointment ID: {}", authentication.getName(), appointmentId);
        try {
            AppointmentDTO appointment = appointmentService.getAppointmentById(authentication.getName(), appointmentId);
            return ResponseEntity.ok(ApiResponse.success("Appointment retrieved successfully", appointment));
        } catch (RuntimeException e) {
            log.error("Error fetching appointment: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{appointmentId}/cancel")
    @Operation(summary = "Cancel an appointment", description = "Cancel an existing appointment")
    public ResponseEntity<ApiResponse<AppointmentDTO>> cancelAppointment(
            @Parameter(description = "Appointment ID") @PathVariable Long appointmentId,
            Authentication authentication) {
        log.info("Patient {} cancelling appointment ID: {}", authentication.getName(), appointmentId);
        try {
            AppointmentDTO appointment = appointmentService.cancelAppointment(authentication.getName(), appointmentId);
            return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", appointment));
        } catch (RuntimeException e) {
            log.error("Error cancelling appointment: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
