package com.doctorai.service;

import com.doctorai.dto.AppointmentDTO;
import com.doctorai.dto.RescheduleAppointmentRequest;
import com.doctorai.model.Appointment;
import com.doctorai.model.Appointment.AppointmentStatus;
import com.doctorai.model.Doctor;
import com.doctorai.model.Patient;
import com.doctorai.model.User;
import com.doctorai.repository.AppointmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReceptionistAppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Get all appointments in the system
     */
    public List<AppointmentDTO> getAllAppointments() {
        log.info("Fetching all appointments");
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .map(this::mapToDTO)
                .sorted((a, b) -> {
                    LocalDate dateA = LocalDate.parse(a.getDate());
                    LocalDate dateB = LocalDate.parse(b.getDate());
                    return dateB.compareTo(dateA);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get appointments for a specific date range
     */
    public List<AppointmentDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching appointments from {} to {}", startDate, endDate);
        
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(apt -> !apt.getAppointmentDate().isBefore(start) && !apt.getAppointmentDate().isAfter(end))
                .collect(Collectors.toList());
                
        return appointments.stream()
                .map(this::mapToDTO)
                .sorted((a, b) -> {
                    LocalDate dateA = LocalDate.parse(a.getDate());
                    LocalDate dateB = LocalDate.parse(b.getDate());
                    return dateA.compareTo(dateB);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get today's appointments
     */
    public List<AppointmentDTO> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        return getAppointmentsByDateRange(today, today);
    }

    /**
     * Get tomorrow's appointments
     */
    public List<AppointmentDTO> getTomorrowAppointments() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return getAppointmentsByDateRange(tomorrow, tomorrow);
    }

    /**
     * Get yesterday's appointments
     */
    public List<AppointmentDTO> getYesterdayAppointments() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        return getAppointmentsByDateRange(yesterday, yesterday);
    }

    /**
     * Get last week's appointments
     */
    public List<AppointmentDTO> getLastWeekAppointments() {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        return getAppointmentsByDateRange(weekAgo, today.minusDays(1));
    }

    /**
     * Get appointments by specific date
     */
    public List<AppointmentDTO> getAppointmentsByDate(LocalDate date) {
        return getAppointmentsByDateRange(date, date);
    }

    /**
     * Reschedule an appointment
     */
    @Transactional
    public AppointmentDTO rescheduleAppointment(RescheduleAppointmentRequest request) {
        log.info("Rescheduling appointment ID: {}", request.getAppointmentId());
        
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + request.getAppointmentId()));
        
        // Parse the new date and time
        LocalDate newDate = LocalDate.parse(request.getDate());
        LocalTime newTime = LocalTime.parse(request.getTime());
        LocalDateTime newDateTime = LocalDateTime.of(newDate, newTime);
        
        appointment.setAppointmentDate(newDateTime);
        
        if (request.getReason() != null) {
            String notes = appointment.getNotes() != null ? appointment.getNotes() : "";
            notes += "\n[Rescheduled by receptionist] " + request.getReason();
            appointment.setNotes(notes.trim());
        }
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Appointment rescheduled successfully to: {}", newDateTime);
        
        return mapToDTO(savedAppointment);
    }

    /**
     * Cancel an appointment
     */
    @Transactional
    public void cancelAppointment(Long appointmentId) {
        log.info("Cancelling appointment ID: {}", appointmentId);
        
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
        
        log.info("Appointment cancelled successfully");
    }

    // Mapping method
    private AppointmentDTO mapToDTO(Appointment appointment) {
        Patient patient = appointment.getPatient();
        User patientUser = patient.getUser();
        Doctor doctor = appointment.getDoctor();
        User doctorUser = doctor.getUser();
        
        // Determine display status
        String displayStatus = mapStatus(appointment.getStatus(), appointment.getAppointmentDate());
        
        // Format time
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        return AppointmentDTO.builder()
                .id(appointment.getId())
                .time(appointment.getAppointmentDate().format(timeFormatter))
                .date(appointment.getAppointmentDate().format(dateFormatter))
                .patientName(patientUser.getFirstName() + " " + patientUser.getLastName())
                .patientId(patient.getPatientId())
                .patientEmail(patientUser.getEmail())
                .patientPhone(patientUser.getPhoneNumber())
                .type(appointment.getType() != null ? formatType(appointment.getType().name()) : "Consultation")
                .status(displayStatus)
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .meetingLink(appointment.getMeetingLink())
                .doctorId(doctor.getId().toString())
                .doctorName("Dr. " + doctorUser.getFirstName() + " " + doctorUser.getLastName())
                .doctorSpecialization(doctor.getSpecialization())
                .build();
    }

    private String mapStatus(AppointmentStatus status, LocalDateTime appointmentDate) {
        LocalDateTime now = LocalDateTime.now();
        
        switch (status) {
            case COMPLETED:
                return "completed";
            case IN_PROGRESS:
                return "in-progress";
            case CANCELLED:
            case NO_SHOW:
                return "cancelled";
            case SCHEDULED:
            case CONFIRMED:
            default:
                // Check if appointment time has passed
                if (appointmentDate.isBefore(now)) {
                    return "completed"; // Past appointments default to completed
                }
                return "upcoming";
        }
    }

    private String formatType(String type) {
        switch (type) {
            case "IN_PERSON":
                return "Consultation";
            case "VIDEO_CALL":
                return "Video Call";
            case "PHONE_CALL":
                return "Phone Call";
            default:
                return type.replace("_", " ");
        }
    }
}
