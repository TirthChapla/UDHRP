package com.doctorai.repository;

import com.doctorai.model.LabReport;
import com.doctorai.model.LabReport.ReportStatus;
import com.doctorai.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    
    List<LabReport> findByPatientId(Long patientId);
    
    List<LabReport> findByPatient(Patient patient);
    
    List<LabReport> findByDoctorId(Long doctorId);
    
    List<LabReport> findByPatientIdAndStatus(Long patientId, ReportStatus status);
    
    List<LabReport> findByStatus(ReportStatus status);
    
    @Query("SELECT l FROM LabReport l WHERE l.patient.patientId = :patientId ORDER BY l.testDate DESC")
    List<LabReport> findByPatientPatientId(@Param("patientId") String patientId);
    
    @Query("SELECT l FROM LabReport l WHERE l.doctor.user.email = :email ORDER BY l.testDate DESC")
    List<LabReport> findByDoctorEmail(@Param("email") String email);
}
