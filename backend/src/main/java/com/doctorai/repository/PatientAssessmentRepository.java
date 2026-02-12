package com.doctorai.repository;

import com.doctorai.model.AssessmentType;
import com.doctorai.model.PatientAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientAssessmentRepository extends JpaRepository<PatientAssessment, Long> {
    List<PatientAssessment> findByPatientPatientId(String patientId);
    List<PatientAssessment> findByPrescriptionId(Long prescriptionId);
    List<PatientAssessment> findByPatientPatientIdAndPrescriptionId(String patientId, Long prescriptionId);
    List<PatientAssessment> findByPatientPatientIdAndType(String patientId, AssessmentType type);
    List<PatientAssessment> findByPrescriptionIdAndType(Long prescriptionId, AssessmentType type);
    List<PatientAssessment> findByPatientPatientIdAndPrescriptionIdAndType(String patientId, Long prescriptionId, AssessmentType type);
}
