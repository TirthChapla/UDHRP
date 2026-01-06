package com.doctorai.service;

import com.doctorai.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class NotificationService {

    /**
     * Send notification to patient about appointment confirmation
     */
    public void sendAppointmentConfirmationNotification(User patient, LocalDateTime appointmentDate, String doctorName) {
        log.info("Sending appointment confirmation notification to patient: {}", patient.getEmail());
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' h:mm a");
        String formattedDate = appointmentDate.format(formatter);
        
        String message = String.format(
            "Your appointment with %s on %s has been confirmed by the receptionist.",
            doctorName, formattedDate
        );
        
        // TODO: Implement Web Push API notification
        // For now, we'll log the notification
        log.info("Notification: {} - {}", patient.getEmail(), message);
        
        // In production, this would:
        // 1. Send web push notification using service worker
        // 2. Send email notification
        // 3. Send SMS notification (optional)
    }

    /**
     * Send notification to patient about appointment reschedule
     */
    public void sendAppointmentRescheduleNotification(User patient, LocalDateTime oldDate, LocalDateTime newDate, String doctorName) {
        log.info("Sending appointment reschedule notification to patient: {}", patient.getEmail());
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' h:mm a");
        String oldFormattedDate = oldDate.format(formatter);
        String newFormattedDate = newDate.format(formatter);
        
        String message = String.format(
            "Your appointment with %s has been rescheduled from %s to %s.",
            doctorName, oldFormattedDate, newFormattedDate
        );
        
        // TODO: Implement Web Push API notification
        log.info("Notification: {} - {}", patient.getEmail(), message);
    }

    /**
     * Send notification to patient about appointment cancellation
     */
    public void sendAppointmentCancellationNotification(User patient, LocalDateTime appointmentDate, String doctorName) {
        log.info("Sending appointment cancellation notification to patient: {}", patient.getEmail());
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' h:mm a");
        String formattedDate = appointmentDate.format(formatter);
        
        String message = String.format(
            "Your appointment with %s on %s has been cancelled.",
            doctorName, formattedDate
        );
        
        // TODO: Implement Web Push API notification
        log.info("Notification: {} - {}", patient.getEmail(), message);
    }
}
