package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.AppointmentDTO;
import com.doctorai.dto.RescheduleAppointmentRequest;
import com.doctorai.dto.ScheduleSummaryDTO;
import com.doctorai.service.DoctorScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/doctor/schedule")
@Tag(name = "Doctor Schedule", description = "Doctor Schedule and Appointment Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService scheduleService;

    // ==================== GET APPOINTMENTS ====================

    @GetMapping("/appointments")
    @Operation(summary = "Get all appointments", description = "Get all appointments for the logged-in doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAllAppointments(Authentication authentication) {
        log.info("Getting all appointments for doctor: {}", authentication.getName());
        List<AppointmentDTO> appointments = scheduleService.getDoctorAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    @GetMapping("/appointments/today")
    @Operation(summary = "Get today's appointments", description = "Get today's appointments for the logged-in doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getTodayAppointments(Authentication authentication) {
        log.info("Getting today's appointments for doctor: {}", authentication.getName());
        List<AppointmentDTO> appointments = scheduleService.getTodayAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Today's appointments retrieved", appointments));
    }

    @GetMapping("/appointments/tomorrow")
    @Operation(summary = "Get tomorrow's appointments", description = "Get tomorrow's appointments for the logged-in doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getTomorrowAppointments(Authentication authentication) {
        log.info("Getting tomorrow's appointments for doctor: {}", authentication.getName());
        List<AppointmentDTO> appointments = scheduleService.getTomorrowAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Tomorrow's appointments retrieved", appointments));
    }

    @GetMapping("/appointments/yesterday")
    @Operation(summary = "Get yesterday's appointments", description = "Get yesterday's appointments for the logged-in doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getYesterdayAppointments(Authentication authentication) {
        log.info("Getting yesterday's appointments for doctor: {}", authentication.getName());
        List<AppointmentDTO> appointments = scheduleService.getYesterdayAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Yesterday's appointments retrieved", appointments));
    }

    @GetMapping("/appointments/last-week")
    @Operation(summary = "Get last week's appointments", description = "Get last 7 days appointments for the logged-in doctor")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getLastWeekAppointments(Authentication authentication) {
        log.info("Getting last week's appointments for doctor: {}", authentication.getName());
        List<AppointmentDTO> appointments = scheduleService.getLastWeekAppointments(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Last week's appointments retrieved", appointments));
    }

    @GetMapping("/appointments/date-range")
    @Operation(summary = "Get appointments by date range", description = "Get appointments for a specific date range")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        log.info("Getting appointments for doctor: {} from {} to {}", authentication.getName(), startDate, endDate);
        List<AppointmentDTO> appointments = scheduleService.getAppointmentsByDateRange(authentication.getName(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    @GetMapping("/appointments/date/{date}")
    @Operation(summary = "Get appointments by date", description = "Get appointments for a specific date")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {
        log.info("Getting appointments for doctor: {} on date: {}", authentication.getName(), date);
        List<AppointmentDTO> appointments = scheduleService.getAppointmentsByDateRange(authentication.getName(), date, date);
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    @GetMapping("/appointments/status/{status}")
    @Operation(summary = "Get appointments by status", description = "Get appointments filtered by status")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAppointmentsByStatus(
            @PathVariable String status,
            Authentication authentication) {
        log.info("Getting appointments with status: {} for doctor: {}", status, authentication.getName());
        List<AppointmentDTO> appointments = scheduleService.getAppointmentsByStatus(authentication.getName(), status);
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    @GetMapping("/appointments/{id}")
    @Operation(summary = "Get appointment by ID", description = "Get a specific appointment by its ID")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getAppointmentById(@PathVariable Long id) {
        log.info("Getting appointment with ID: {}", id);
        AppointmentDTO appointment = scheduleService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success("Appointment retrieved", appointment));
    }

    // ==================== SCHEDULE SUMMARY ====================

    @GetMapping("/summary/today")
    @Operation(summary = "Get today's summary", description = "Get summary of today's appointments")
    public ResponseEntity<ApiResponse<ScheduleSummaryDTO>> getTodaySummary(Authentication authentication) {
        log.info("Getting today's summary for doctor: {}", authentication.getName());
        LocalDate today = LocalDate.now();
        ScheduleSummaryDTO summary = scheduleService.getScheduleSummary(authentication.getName(), today, today);
        return ResponseEntity.ok(ApiResponse.success("Summary retrieved", summary));
    }

    @GetMapping("/summary/date-range")
    @Operation(summary = "Get summary by date range", description = "Get summary for a specific date range")
    public ResponseEntity<ApiResponse<ScheduleSummaryDTO>> getSummaryByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        log.info("Getting summary for doctor: {} from {} to {}", authentication.getName(), startDate, endDate);
        ScheduleSummaryDTO summary = scheduleService.getScheduleSummary(authentication.getName(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Summary retrieved", summary));
    }

    // ==================== APPOINTMENT ACTIONS ====================

    @PostMapping("/appointments/reschedule")
    @Operation(summary = "Reschedule appointment", description = "Reschedule an existing appointment")
    public ResponseEntity<ApiResponse<AppointmentDTO>> rescheduleAppointment(
            @Valid @RequestBody RescheduleAppointmentRequest request,
            Authentication authentication) {
        log.info("Rescheduling appointment ID: {} by doctor: {}", request.getAppointmentId(), authentication.getName());
        AppointmentDTO appointment = scheduleService.rescheduleAppointment(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Appointment rescheduled successfully", appointment));
    }

    @PatchMapping("/appointments/{id}/status")
    @Operation(summary = "Update appointment status", description = "Update the status of an appointment")
    public ResponseEntity<ApiResponse<AppointmentDTO>> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        log.info("Updating status of appointment ID: {} to {} by doctor: {}", id, status, authentication.getName());
        AppointmentDTO appointment = scheduleService.updateAppointmentStatus(authentication.getName(), id, status);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated successfully", appointment));
    }
}
