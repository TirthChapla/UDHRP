package com.doctorai.repository;

import com.doctorai.model.Patient;
import com.doctorai.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    List<Prescription> findByPatientId(Long patientId);
    
    List<Prescription> findByPatient(Patient patient);
    
    List<Prescription> findByDoctorId(Long doctorId);
    
    List<Prescription> findByAppointmentId(Long appointmentId);
    
    Optional<Prescription> findByPrescriptionId(String prescriptionId);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.patientId = :patientId ORDER BY p.prescriptionDate DESC")
    List<Prescription> findByPatientPatientId(@Param("patientId") String patientId);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.user.email = :email ORDER BY p.prescriptionDate DESC")
    List<Prescription> findByDoctorEmail(@Param("email") String email);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.patientId = :patientId AND p.doctor.user.email = :doctorEmail ORDER BY p.prescriptionDate DESC")
    List<Prescription> findByPatientPatientIdAndDoctorEmail(@Param("patientId") String patientId, @Param("doctorEmail") String doctorEmail);
    
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.doctor.user.email = :email")
    Long countByDoctorEmail(@Param("email") String email);
}
