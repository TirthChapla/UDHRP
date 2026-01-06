package com.doctorai.service;

import com.doctorai.dto.AppointmentDTO;
import com.doctorai.dto.RescheduleAppointmentRequest;
import com.doctorai.dto.ScheduleSummaryDTO;
import com.doctorai.model.Appointment;
import com.doctorai.model.Appointment.AppointmentStatus;
import com.doctorai.model.Doctor;
import com.doctorai.model.Patient;
import com.doctorai.model.User;
import com.doctorai.repository.AppointmentRepository;
import com.doctorai.repository.DoctorRepository;
import com.doctorai.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DoctorScheduleService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all appointments for a doctor
     */
    public List<AppointmentDTO> getDoctorAppointments(String doctorEmail) {
        log.info("Fetching all appointments for doctor: {}", doctorEmail);
        List<Appointment> appointments = appointmentRepository.findByDoctorEmail(doctorEmail);
        return appointments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get appointments for a specific date range
     */
    public List<AppointmentDTO> getAppointmentsByDateRange(String doctorEmail, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching appointments for doctor: {} from {} to {}", doctorEmail, startDate, endDate);
        
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        log.info("Query parameters - start: {}, end: {}", start, end);
        
        List<Appointment> appointments = appointmentRepository.findByDoctorEmailAndDateRange(doctorEmail, start, end);
        
        log.info("Found {} appointments for doctor {}", appointments.size(), doctorEmail);
        
        return appointments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get today's appointments
     */
    public List<AppointmentDTO> getTodayAppointments(String doctorEmail) {
        LocalDate today = LocalDate.now();
        return getAppointmentsByDateRange(doctorEmail, today, today);
    }

    /**
     * Get tomorrow's appointments
     */
    public List<AppointmentDTO> getTomorrowAppointments(String doctorEmail) {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return getAppointmentsByDateRange(doctorEmail, tomorrow, tomorrow);
    }

    /**
     * Get yesterday's appointments
     */
    public List<AppointmentDTO> getYesterdayAppointments(String doctorEmail) {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        return getAppointmentsByDateRange(doctorEmail, yesterday, yesterday);
    }

    /**
     * Get last week's appointments
     */
    public List<AppointmentDTO> getLastWeekAppointments(String doctorEmail) {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        return getAppointmentsByDateRange(doctorEmail, weekAgo, today.minusDays(1));
    }

    /**
     * Get appointments by status
     */
    public List<AppointmentDTO> getAppointmentsByStatus(String doctorEmail, String status) {
        log.info("Fetching appointments with status: {} for doctor: {}", status, doctorEmail);
        
        AppointmentStatus appointmentStatus = AppointmentStatus.valueOf(status.toUpperCase());
        List<Appointment> appointments = appointmentRepository.findByDoctorEmailAndStatus(doctorEmail, appointmentStatus);
        
        return appointments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get schedule summary for a date range
     */
    public ScheduleSummaryDTO getScheduleSummary(String doctorEmail, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching schedule summary for doctor: {} from {} to {}", doctorEmail, startDate, endDate);
        
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        List<Appointment> appointments = appointmentRepository.findByDoctorEmailAndDateRange(doctorEmail, start, end);
        
        int completed = 0;
        int inProgress = 0;
        int upcoming = 0;
        int cancelled = 0;
        
        for (Appointment apt : appointments) {
            switch (apt.getStatus()) {
                case COMPLETED:
                    completed++;
                    break;
                case IN_PROGRESS:
                    inProgress++;
                    break;
                case SCHEDULED:
                case CONFIRMED:
                    upcoming++;
                    break;
                case CANCELLED:
                case NO_SHOW:
                    cancelled++;
                    break;
            }
        }
        
        return ScheduleSummaryDTO.builder()
                .total(appointments.size())
                .completed(completed)
                .inProgress(inProgress)
                .upcoming(upcoming)
                .cancelled(cancelled)
                .build();
    }

    /**
     * Reschedule an appointment
     */
    @Transactional
    public AppointmentDTO rescheduleAppointment(String doctorEmail, RescheduleAppointmentRequest request) {
        log.info("Rescheduling appointment ID: {} by doctor: {}", request.getAppointmentId(), doctorEmail);
        
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + request.getAppointmentId()));
        
        // Verify the doctor owns this appointment
        if (!appointment.getDoctor().getUser().getEmail().equals(doctorEmail)) {
            throw new RuntimeException("You are not authorized to reschedule this appointment");
        }
        
        // Parse the new date and time
        LocalDate newDate = LocalDate.parse(request.getDate());
        LocalTime newTime = LocalTime.parse(request.getTime());
        LocalDateTime newDateTime = LocalDateTime.of(newDate, newTime);
        
        appointment.setAppointmentDate(newDateTime);
        
        if (request.getReason() != null) {
            String notes = appointment.getNotes() != null ? appointment.getNotes() : "";
            notes += "\n[Rescheduled] " + request.getReason();
            appointment.setNotes(notes.trim());
        }
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Appointment rescheduled successfully to: {}", newDateTime);
        
        return mapToDTO(savedAppointment);
    }

    /**
     * Update appointment status
     */
    @Transactional
    public AppointmentDTO updateAppointmentStatus(String doctorEmail, Long appointmentId, String status) {
        log.info("Updating status of appointment ID: {} to {} by doctor: {}", appointmentId, status, doctorEmail);
        
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        
        // Verify the doctor owns this appointment
        if (!appointment.getDoctor().getUser().getEmail().equals(doctorEmail)) {
            throw new RuntimeException("You are not authorized to update this appointment");
        }
        
        AppointmentStatus newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        appointment.setStatus(newStatus);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Appointment status updated successfully");
        
        return mapToDTO(savedAppointment);
    }

    /**
     * Get appointment by ID
     */
    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
        return mapToDTO(appointment);
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
