package com.doctorai.repository;

import com.doctorai.model.LabReport;
import com.doctorai.model.LabReport.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    
    List<LabReport> findByPatientId(Long patientId);
    
    List<LabReport> findByDoctorId(Long doctorId);
    
    List<LabReport> findByPatientIdAndStatus(Long patientId, ReportStatus status);
    
    List<LabReport> findByStatus(ReportStatus status);
}
