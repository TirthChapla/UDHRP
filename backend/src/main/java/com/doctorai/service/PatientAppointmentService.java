package com.doctorai.service;

import com.doctorai.dto.AppointmentDTO;
import com.doctorai.dto.BookAppointmentRequest;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.model.Appointment;
import com.doctorai.model.Appointment.AppointmentStatus;
import com.doctorai.model.Appointment.AppointmentType;
import com.doctorai.model.Doctor;
import com.doctorai.model.Patient;
import com.doctorai.model.User;
import com.doctorai.repository.AppointmentRepository;
import com.doctorai.repository.DoctorRepository;
import com.doctorai.repository.PatientRepository;
import com.doctorai.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PatientAppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Book a new appointment
     */
    @Transactional
    public AppointmentDTO bookAppointment(String patientEmail, BookAppointmentRequest request) {
        log.info("Booking appointment for patient: {} with doctor ID: {}", patientEmail, request.getDoctorId());

        // Get patient
        User patientUser = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + patientEmail));
        
        Patient patient = patientRepository.findByUserId(patientUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + patientEmail));

        // Get doctor
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + request.getDoctorId()));

        // Check if doctor is available
        if (!Boolean.TRUE.equals(doctor.getIsAvailable())) {
            throw new RuntimeException("Doctor is currently not available for appointments");
        }

        // Parse date and time
        LocalDateTime appointmentDateTime = parseDateTime(request.getDate(), request.getTime());

        // Validate appointment is in the future
        if (appointmentDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Appointment date/time must be in the future");
        }

        // Validate appointment time is within doctor's working hours
        validateWorkingHours(doctor, appointmentDateTime);

        // Check for conflicting appointments
        checkForConflicts(doctor.getId(), appointmentDateTime);

        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(appointmentDateTime);
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        
        // Set appointment type
        if (request.getType() != null && !request.getType().isEmpty()) {
            try {
                appointment.setType(AppointmentType.valueOf(request.getType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                appointment.setType(AppointmentType.IN_PERSON);
            }
        } else {
            appointment.setType(AppointmentType.IN_PERSON);
        }
        
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Appointment booked successfully with ID: {}", savedAppointment.getId());

        return mapToDTO(savedAppointment);
    }
    
    /**
     * Validate that the appointment time is within doctor's working hours
     */
    private void validateWorkingHours(Doctor doctor, LocalDateTime appointmentDateTime) {
        String workStartTime = doctor.getWorkStartTime();
        String workEndTime = doctor.getWorkEndTime();
        
        // If working hours not set, use default 09:00 - 17:00
        if (workStartTime == null || workStartTime.isEmpty()) {
            workStartTime = "09:00";
        }
        if (workEndTime == null || workEndTime.isEmpty()) {
            workEndTime = "17:00";
        }
        
        try {
            LocalTime startTime = LocalTime.parse(workStartTime);
            LocalTime endTime = LocalTime.parse(workEndTime);
            LocalTime appointmentTime = appointmentDateTime.toLocalTime();
            
            if (appointmentTime.isBefore(startTime) || appointmentTime.isAfter(endTime)) {
                String formattedStart = formatTimeFor12Hour(startTime);
                String formattedEnd = formatTimeFor12Hour(endTime);
                throw new RuntimeException(
                    String.format("The selected time is outside the doctor's working hours. " +
                        "Please select a time between %s and %s.", formattedStart, formattedEnd)
                );
            }
        } catch (RuntimeException e) {
            throw e; // Re-throw our custom exception
        } catch (Exception e) {
            log.warn("Error parsing working hours for doctor {}: {}", doctor.getId(), e.getMessage());
            // If there's a parsing error, allow the booking (fail open)
        }
    }
    
    /**
     * Format LocalTime to 12-hour format with AM/PM
     */
    private String formatTimeFor12Hour(LocalTime time) {
        int hour = time.getHour();
        int minute = time.getMinute();
        String ampm = hour >= 12 ? "PM" : "AM";
        if (hour > 12) hour -= 12;
        if (hour == 0) hour = 12;
        return String.format("%d:%02d %s", hour, minute, ampm);
    }

    /**
     * Get all appointments for a patient
     */
    public List<AppointmentDTO> getPatientAppointments(String patientEmail) {
        log.info("Fetching appointments for patient: {}", patientEmail);

        User patientUser = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + patientEmail));
        
        Patient patient = patientRepository.findByUserId(patientUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + patientEmail));

        List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());
        
        return appointments.stream()
                .map(this::mapToDTO)
                .sorted((a, b) -> {
                    // Sort by date descending (newest first)
                    LocalDate dateA = LocalDate.parse(a.getDate());
                    LocalDate dateB = LocalDate.parse(b.getDate());
                    return dateB.compareTo(dateA);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming appointments for a patient
     */
    public List<AppointmentDTO> getUpcomingAppointments(String patientEmail) {
        log.info("Fetching upcoming appointments for patient: {}", patientEmail);

        User patientUser = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + patientEmail));
        
        Patient patient = patientRepository.findByUserId(patientUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + patientEmail));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureEnd = now.plusMonths(3); // Get appointments for next 3 months

        List<Appointment> appointments = appointmentRepository.findByPatientIdAndAppointmentDateBetween(
                patient.getId(), now, futureEnd);
        
        return appointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.SCHEDULED || 
                              apt.getStatus() == AppointmentStatus.CONFIRMED)
                .map(this::mapToDTO)
                .sorted((a, b) -> {
                    LocalDate dateA = LocalDate.parse(a.getDate());
                    LocalDate dateB = LocalDate.parse(b.getDate());
                    return dateA.compareTo(dateB); // Sort ascending for upcoming
                })
                .collect(Collectors.toList());
    }

    /**
     * Cancel an appointment
     */
    @Transactional
    public AppointmentDTO cancelAppointment(String patientEmail, Long appointmentId) {
        log.info("Cancelling appointment ID: {} for patient: {}", appointmentId, patientEmail);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Verify the patient owns this appointment
        if (!appointment.getPatient().getUser().getEmail().equals(patientEmail)) {
            throw new RuntimeException("You are not authorized to cancel this appointment");
        }

        // Check if appointment can be cancelled
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed appointment");
        }
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        log.info("Appointment cancelled successfully");
        return mapToDTO(savedAppointment);
    }

    /**
     * Get appointment by ID (for patient)
     */
    public AppointmentDTO getAppointmentById(String patientEmail, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Verify the patient owns this appointment
        if (!appointment.getPatient().getUser().getEmail().equals(patientEmail)) {
            throw new RuntimeException("You are not authorized to view this appointment");
        }

        return mapToDTO(appointment);
    }

    // Private helper methods

    private LocalDateTime parseDateTime(String date, String time) {
        try {
            LocalDate appointmentDate = LocalDate.parse(date);
            LocalTime appointmentTime;
            
            // Try parsing different time formats
            try {
                // Try 24-hour format first (HH:mm)
                appointmentTime = LocalTime.parse(time, DateTimeFormatter.ofPattern("HH:mm"));
            } catch (DateTimeParseException e1) {
                try {
                    // Try 12-hour format with AM/PM
                    appointmentTime = LocalTime.parse(time, DateTimeFormatter.ofPattern("h:mm a"));
                } catch (DateTimeParseException e2) {
                    try {
                        // Try another 12-hour format
                        appointmentTime = LocalTime.parse(time, DateTimeFormatter.ofPattern("hh:mm a"));
                    } catch (DateTimeParseException e3) {
                        throw new RuntimeException("Invalid time format. Please use HH:mm or h:mm AM/PM format");
                    }
                }
            }
            
            return LocalDateTime.of(appointmentDate, appointmentTime);
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid date format. Please use yyyy-MM-dd format");
        }
    }

    private void checkForConflicts(Long doctorId, LocalDateTime appointmentDateTime) {
        // Check for appointments within 30 minutes of the requested time
        LocalDateTime start = appointmentDateTime.minusMinutes(30);
        LocalDateTime end = appointmentDateTime.plusMinutes(30);

        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateBetween(
                doctorId, start, end);

        boolean hasConflict = existingAppointments.stream()
                .anyMatch(apt -> apt.getStatus() == AppointmentStatus.SCHEDULED || 
                                apt.getStatus() == AppointmentStatus.CONFIRMED);

        if (hasConflict) {
            throw new RuntimeException("The selected time slot is not available. Please choose a different time.");
        }
    }

    private AppointmentDTO mapToDTO(Appointment appointment) {
        Patient patient = appointment.getPatient();
        User patientUser = patient.getUser();
        Doctor doctor = appointment.getDoctor();
        User doctorUser = doctor.getUser();

        // Format time and date
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Determine display status
        String displayStatus = mapStatus(appointment.getStatus(), appointment.getAppointmentDate());

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
            case CONFIRMED:
                return appointmentDate.isBefore(now) ? "completed" : "confirmed";
            case SCHEDULED:
            default:
                return appointmentDate.isBefore(now) ? "completed" : "pending";
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
