package com.doctorai.service;

import com.doctorai.dto.AssessmentDTO;
import com.doctorai.dto.CreateAssessmentRequest;
import com.doctorai.dto.UpdateAssessmentRequest;
import com.doctorai.model.*;
import com.doctorai.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AssessmentService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Autowired
    private PatientAssessmentRepository assessmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public AssessmentDTO createAssessment(String doctorEmail, AssessmentType type, CreateAssessmentRequest request) {
        User doctorUser = userRepository.findByEmail(doctorEmail)
            .orElseThrow(() -> new RuntimeException("Doctor user not found"));
        Doctor doctor = doctorRepository.findByUserId(doctorUser.getId())
            .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        Patient patient = patientRepository.findByPatientId(request.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + request.getPatientId()));
        Prescription prescription = prescriptionRepository.findById(request.getPrescriptionId())
            .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + request.getPrescriptionId()));

        if (!prescription.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("You are not authorized to add assessment for this prescription");
        }
        if (!prescription.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Prescription patient mismatch");
        }

        PatientAssessment assessment = new PatientAssessment();
        assessment.setType(type);
        assessment.setPatient(patient);
        assessment.setPrescription(prescription);
        assessment.setDoctor(doctor);
        assessment.setDataJson(writeDataJson(request.getData()));

        PatientAssessment saved = assessmentRepository.save(assessment);
        return mapToDTO(saved);
    }

    public AssessmentDTO getAssessmentById(Long id, String doctorEmail) {
        PatientAssessment assessment = assessmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assessment not found with ID: " + id));
        verifyDoctorAccess(assessment, doctorEmail);
        return mapToDTO(assessment);
    }

    public List<AssessmentDTO> getAssessments(String doctorEmail, String patientId, Long prescriptionId, AssessmentType type) {
        List<PatientAssessment> assessments;
        if (patientId != null && prescriptionId != null && type != null) {
            assessments = assessmentRepository.findByPatientPatientIdAndPrescriptionIdAndType(patientId, prescriptionId, type);
        } else if (patientId != null && prescriptionId != null) {
            assessments = assessmentRepository.findByPatientPatientIdAndPrescriptionId(patientId, prescriptionId);
        } else if (patientId != null && type != null) {
            assessments = assessmentRepository.findByPatientPatientIdAndType(patientId, type);
        } else if (prescriptionId != null && type != null) {
            assessments = assessmentRepository.findByPrescriptionIdAndType(prescriptionId, type);
        } else if (patientId != null) {
            assessments = assessmentRepository.findByPatientPatientId(patientId);
        } else if (prescriptionId != null) {
            assessments = assessmentRepository.findByPrescriptionId(prescriptionId);
        } else if (type != null) {
            assessments = assessmentRepository.findAll().stream()
                .filter(a -> a.getType() == type)
                .collect(Collectors.toList());
        } else {
            assessments = assessmentRepository.findAll();
        }

        return assessments.stream()
            .filter(a -> isDoctorOwner(a, doctorEmail))
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public AssessmentDTO updateAssessment(Long id, String doctorEmail, UpdateAssessmentRequest request) {
        PatientAssessment assessment = assessmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assessment not found with ID: " + id));
        verifyDoctorAccess(assessment, doctorEmail);
        assessment.setDataJson(writeDataJson(request.getData()));
        PatientAssessment saved = assessmentRepository.save(assessment);
        return mapToDTO(saved);
    }

    @Transactional
    public void deleteAssessment(Long id, String doctorEmail) {
        PatientAssessment assessment = assessmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assessment not found with ID: " + id));
        verifyDoctorAccess(assessment, doctorEmail);
        assessmentRepository.delete(assessment);
    }

    private void verifyDoctorAccess(PatientAssessment assessment, String doctorEmail) {
        if (!isDoctorOwner(assessment, doctorEmail)) {
            throw new RuntimeException("You are not authorized to access this assessment");
        }
    }

    private boolean isDoctorOwner(PatientAssessment assessment, String doctorEmail) {
        return assessment.getDoctor() != null
            && assessment.getDoctor().getUser() != null
            && doctorEmail.equals(assessment.getDoctor().getUser().getEmail());
    }

    private AssessmentDTO mapToDTO(PatientAssessment assessment) {
        return AssessmentDTO.builder()
            .id(assessment.getId())
            .type(assessment.getType())
            .patientId(assessment.getPatient().getPatientId())
            .prescriptionId(assessment.getPrescription().getId())
            .data(readDataJson(assessment.getDataJson()))
            .createdAt(assessment.getCreatedAt() != null ? assessment.getCreatedAt().format(DATE_TIME_FORMATTER) : null)
            .build();
    }

    private String writeDataJson(Map<String, Object> data) {
        try {
            return objectMapper.writeValueAsString(data != null ? data : Collections.emptyMap());
        } catch (Exception ex) {
            throw new RuntimeException("Failed to serialize assessment data", ex);
        }
    }

    private Map<String, Object> readDataJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ex) {
            log.warn("Failed to parse assessment data json", ex);
            return Collections.emptyMap();
        }
    }
}
