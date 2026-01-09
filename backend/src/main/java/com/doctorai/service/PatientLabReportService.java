package com.doctorai.service;

import com.doctorai.dto.LabReportDTO;
import com.doctorai.model.LabReport;
import com.doctorai.model.Patient;
import com.doctorai.model.Prescription;
import com.doctorai.repository.LabReportRepository;
import com.doctorai.repository.PatientRepository;
import com.doctorai.repository.PrescriptionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing patient lab reports
 * Handles retrieval of lab reports linked to prescriptions
 */
@Service
@Slf4j
public class PatientLabReportService {

    @Autowired
    private LabReportRepository labReportRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    /**
     * Get lab reports for a specific prescription
     *
     * @param prescriptionId The ID of the prescription
     * @param email The email of the patient
     * @return List of lab reports linked to the prescription
     */
    public List<LabReportDTO> getLabReportsForPrescription(Long prescriptionId, String email) {
        try {
            log.info("Fetching lab reports for prescription: {} for patient: {}", prescriptionId, email);

            // 1. Find patient by email
            Optional<Patient> patientOptional = patientRepository.findByUserEmail(email);
            if (patientOptional.isEmpty()) {
                log.warn("Patient not found with email: {}", email);
                return new ArrayList<>();
            }
            Patient patient = patientOptional.get();

            // 2. Find prescription by ID and verify it belongs to patient
            Optional<Prescription> prescriptionOptional = prescriptionRepository.findById(prescriptionId);
            if (prescriptionOptional.isEmpty()) {
                log.warn("Prescription not found with ID: {}", prescriptionId);
                return new ArrayList<>();
            }

            Prescription prescription = prescriptionOptional.get();
            if (!prescription.getPatient().getPatientId().equals(patient.getPatientId())) {
                log.warn("Prescription ID: {} does not belong to patient: {}", prescriptionId, email);
                return new ArrayList<>();
            }

            // 3. Parse lab report IDs from prescription.labReports (CSV string)
            String labReportsStr = prescription.getLabReports();
            if (labReportsStr == null || labReportsStr.trim().isEmpty()) {
                log.debug("No lab reports linked to prescription: {}", prescriptionId);
                return new ArrayList<>();
            }

            List<Long> labReportIds = Arrays.stream(labReportsStr.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(idStr -> {
                        try {
                            return Long.parseLong(idStr);
                        } catch (NumberFormatException ex) {
                            log.debug("Skipping non-numeric lab report reference: {}", idStr);
                            return null;
                        }
                    })
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

            if (labReportIds.isEmpty()) {
                log.debug("No valid lab report IDs found for prescription: {}", prescriptionId);
                return new ArrayList<>();
            }

            // 4. Query lab reports by IDs
            List<LabReport> labReports = labReportRepository.findAllById(labReportIds);

            // 5. Map to DTOs
            List<LabReportDTO> labReportDTOs = labReports.stream()
                    .map(this::mapLabReportToDTO)
                    .collect(Collectors.toList());

            log.info("Found {} lab reports for prescription: {}", labReportDTOs.size(), prescriptionId);
            return labReportDTOs;

        } catch (Exception ex) {
            log.error("Error fetching lab reports for prescription: {}", prescriptionId, ex);
            return new ArrayList<>();
        }
    }

    /**
     * Get all lab reports for a patient
     *
     * @param email The email of the patient
     * @return List of all lab reports for the patient
     */
    public List<LabReportDTO> getPatientLabReports(String email) {
        try {
            log.info("Fetching all lab reports for patient: {}", email);

            Optional<Patient> patientOptional = patientRepository.findByUserEmail(email);
            if (patientOptional.isEmpty()) {
                log.warn("Patient not found with email: {}", email);
                return new ArrayList<>();
            }
            Patient patient = patientOptional.get();

            List<LabReport> labReports = labReportRepository.findByPatient(patient);
            log.info("Found {} lab reports for patient: {}", labReports.size(), email);

            return labReports.stream()
                    .map(this::mapLabReportToDTO)
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            log.error("Error fetching lab reports for patient: {}", email, ex);
            return new ArrayList<>();
        }
    }

    /**
     * Map LabReport entity to LabReportDTO
     *
     * @param labReport The lab report entity
     * @return The lab report DTO
     */
    private LabReportDTO mapLabReportToDTO(LabReport labReport) {
        if (labReport == null) {
            return null;
        }

        String doctorName = labReport.getDoctor() != null && labReport.getDoctor().getUser() != null ?
                labReport.getDoctor().getUser().getFirstName() + " " + labReport.getDoctor().getUser().getLastName() :
                "Unknown";

        String status = labReport.getStatus() != null ? labReport.getStatus().toString().toLowerCase() : "unknown";

        return LabReportDTO.builder()
                .id(labReport.getId())
                .reportId("LAB-" + labReport.getId())
                .date(labReport.getTestDate() != null ? labReport.getTestDate().toString() : null)
                .testName(labReport.getTestName())
                .status(status)
                .details(labReport.getDoctorNotes())
                .results(labReport.getResults())
                .laboratoryName(labReport.getLaboratoryName())
                .doctorNotes(labReport.getDoctorNotes())
                .patientId(labReport.getPatient() != null ? labReport.getPatient().getPatientId() : null)
                .patientName(labReport.getPatient() != null && labReport.getPatient().getUser() != null ? 
                        labReport.getPatient().getUser().getFirstName() : null)
                .doctorId(labReport.getDoctor() != null ? labReport.getDoctor().getId().toString() : null)
                .doctorName(doctorName)
                .reportFilePath(labReport.getReportFilePath())
                .build();
    }
}
