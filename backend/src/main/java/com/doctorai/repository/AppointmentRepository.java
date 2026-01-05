package com.doctorai.repository;

import com.doctorai.model.Appointment;
import com.doctorai.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatientId(Long patientId);
    
    List<Appointment> findByDoctorId(Long doctorId);
    
    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
    
    List<Appointment> findByDoctorIdAndAppointmentDateBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    
    List<Appointment> findByPatientIdAndAppointmentDateBetween(Long patientId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.user.email = :email ORDER BY a.appointmentDate DESC")
    List<Appointment> findByDoctorEmail(@Param("email") String email);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.user.email = :email AND a.appointmentDate BETWEEN :start AND :end ORDER BY a.appointmentDate ASC")
    List<Appointment> findByDoctorEmailAndDateRange(
            @Param("email") String email, 
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.user.email = :email AND a.status = :status ORDER BY a.appointmentDate ASC")
    List<Appointment> findByDoctorEmailAndStatus(
            @Param("email") String email, 
            @Param("status") AppointmentStatus status);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.user.email = :email")
    Long countByDoctorEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.user.email = :email AND a.status = :status")
    Long countByDoctorEmailAndStatus(@Param("email") String email, @Param("status") AppointmentStatus status);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.user.email = :email AND a.appointmentDate BETWEEN :start AND :end")
    Long countByDoctorEmailAndDateRange(
            @Param("email") String email, 
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
}
