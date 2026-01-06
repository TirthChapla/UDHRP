package com.doctorai.controller;

import com.doctorai.dto.ApiResponse;
import com.doctorai.dto.AppointmentDTO;
import com.doctorai.dto.RescheduleAppointmentRequest;
import com.doctorai.service.ReceptionistAppointmentService;
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
@RequestMapping("/receptionist/appointments")
@Tag(name = "Receptionist Appointments", description = "Receptionist Appointment Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ReceptionistAppointmentController {

    @Autowired
    private ReceptionistAppointmentService appointmentService;

    @GetMapping
    @Operation(summary = "Get all appointments", description = "Get all appointments in the system")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAllAppointments(Authentication authentication) {
        log.info("Receptionist {} fetching all appointments", authentication.getName());
        List<AppointmentDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    @GetMapping("/today")
    @Operation(summary = "Get today's appointments", description = "Get all appointments for today")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getTodayAppointments(Authentication authentication) {
        log.info("Receptionist {} fetching today's appointments", authentication.getName());
        List<AppointmentDTO> appointments = appointmentService.getTodayAppointments();
        return ResponseEntity.ok(ApiResponse.success("Today's appointments retrieved", appointments));
    }

    @GetMapping("/tomorrow")
    @Operation(summary = "Get tomorrow's appointments", description = "Get all appointments for tomorrow")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getTomorrowAppointments(Authentication authentication) {
        log.info("Receptionist {} fetching tomorrow's appointments", authentication.getName());
        List<AppointmentDTO> appointments = appointmentService.getTomorrowAppointments();
        return ResponseEntity.ok(ApiResponse.success("Tomorrow's appointments retrieved", appointments));
    }

    @GetMapping("/yesterday")
    @Operation(summary = "Get yesterday's appointments", description = "Get all appointments from yesterday")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getYesterdayAppointments(Authentication authentication) {
        log.info("Receptionist {} fetching yesterday's appointments", authentication.getName());
        List<AppointmentDTO> appointments = appointmentService.getYesterdayAppointments();
        return ResponseEntity.ok(ApiResponse.success("Yesterday's appointments retrieved", appointments));
    }

    @GetMapping("/last-week")
    @Operation(summary = "Get last week's appointments", description = "Get appointments from the last 7 days")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getLastWeekAppointments(Authentication authentication) {
        log.info("Receptionist {} fetching last week's appointments", authentication.getName());
        List<AppointmentDTO> appointments = appointmentService.getLastWeekAppointments();
        return ResponseEntity.ok(ApiResponse.success("Last week's appointments retrieved", appointments));
    }

    @GetMapping("/date/{date}")
    @Operation(summary = "Get appointments by date", description = "Get appointments for a specific date")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {
        log.info("Receptionist {} fetching appointments for date: {}", authentication.getName(), date);
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByDate(date);
        return ResponseEntity.ok(ApiResponse.success("Appointments retrieved", appointments));
    }

    @PutMapping("/{appointmentId}/reschedule")
    @Operation(summary = "Reschedule appointment", description = "Reschedule an appointment to a new date/time")
    public ResponseEntity<ApiResponse<AppointmentDTO>> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @Valid @RequestBody RescheduleAppointmentRequest request,
            Authentication authentication) {
        log.info("Receptionist {} rescheduling appointment ID: {}", authentication.getName(), appointmentId);
        request.setAppointmentId(appointmentId);
        AppointmentDTO appointment = appointmentService.rescheduleAppointment(request);
        return ResponseEntity.ok(ApiResponse.success("Appointment rescheduled successfully", appointment));
    }

    @DeleteMapping("/{appointmentId}")
    @Operation(summary = "Cancel appointment", description = "Cancel an appointment")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @PathVariable Long appointmentId,
            Authentication authentication) {
        log.info("Receptionist {} cancelling appointment ID: {}", authentication.getName(), appointmentId);
        appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", null));
    }
}
