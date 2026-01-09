package com.doctorai.service;

import com.doctorai.dto.MedicationDTO;
import com.doctorai.dto.PrescriptionDTO;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.model.Medication;
import com.doctorai.model.Patient;
import com.doctorai.model.Prescription;
import com.doctorai.repository.PatientRepository;
import com.doctorai.repository.PrescriptionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PatientMedicalRecordsService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // ==================== PRESCRIPTIONS ====================

    /**
     * Get all prescriptions for a patient by email.
     */
    public List<PrescriptionDTO> getPatientPrescriptions(String email) {
        log.info("Fetching prescriptions for patient with email: {}", email);

        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        List<Prescription> prescriptions = prescriptionRepository.findByPatient(patient);
        log.info("Found {} prescriptions for patient ID: {}", prescriptions.size(), patient.getId());

        return prescriptions.stream()
                .sorted((p1, p2) -> {
                    // Sort by prescription date descending (most recent first)
                    if (p1.getPrescriptionDate() == null && p2.getPrescriptionDate() == null) return 0;
                    if (p1.getPrescriptionDate() == null) return 1;
                    if (p2.getPrescriptionDate() == null) return -1;
                    return p2.getPrescriptionDate().compareTo(p1.getPrescriptionDate());
                })
                .map(this::mapPrescriptionToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a single prescription by ID for the given patient email.
     */
    public PrescriptionDTO getPrescriptionById(Long prescriptionId, String email) {
        log.info("Fetching prescription ID: {} for patient email: {}", prescriptionId, email);

        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        if (!prescription.getPatient().getId().equals(patient.getId())) {
            log.error("Prescription ID: {} does not belong to patient ID: {}", prescriptionId, patient.getId());
            throw new ResourceNotFoundException("Prescription not found");
        }

        return mapPrescriptionToDTO(prescription);
    }

    /**
     * Get unique doctor names from prescriptions for the patient.
     */
    public List<String> getDoctorsFromPrescriptions(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return prescriptionRepository.findByPatient(patient).stream()
                .map(Prescription::getDoctor)
                .filter(doctor -> doctor != null && doctor.getUser() != null)
                .map(doctor -> doctor.getUser().getFirstName())
                .filter(name -> name != null && !name.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    /**
     * Get list of years (descending) for the patient's prescriptions.
     */
    public List<Integer> getYearsFromPrescriptions(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return prescriptionRepository.findByPatient(patient).stream()
                .map(p -> p.getPrescriptionDate().getYear())
                .distinct()
                .sorted((a, b) -> b.compareTo(a))
                .collect(Collectors.toList());
    }

    /**
     * Filter prescriptions by search, doctor, month, and year.
     */
    public List<PrescriptionDTO> filterPrescriptions(String email, String search, String doctor,
                                                     Integer month, Integer year) {
        List<PrescriptionDTO> all = getPatientPrescriptions(email);
        return all.stream()
                .filter(p -> filterBySearch(p, search))
                .filter(p -> filterByDoctor(p, doctor))
                .filter(p -> filterByMonth(p, month))
                .filter(p -> filterByYear(p, year))
                .collect(Collectors.toList());
    }

    // ==================== MAPPERS ====================

    private PrescriptionDTO mapPrescriptionToDTO(Prescription prescription) {
        if (prescription == null) {
            return null;
        }

        String doctorName = prescription.getDoctor() != null && prescription.getDoctor().getUser() != null
                ? prescription.getDoctor().getUser().getFirstName() + " " + prescription.getDoctor().getUser().getLastName()
                : "Unknown";

        List<String> labReportRefs = new ArrayList<>();
        List<Long> labReportIds = new ArrayList<>();
        if (prescription.getLabReports() != null && !prescription.getLabReports().isEmpty()) {
            labReportRefs = Arrays.stream(prescription.getLabReports().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            labReportIds = extractLabReportIds(prescription.getLabReports());
        }

        return PrescriptionDTO.builder()
                .id(prescription.getId())
                .prescriptionId(prescription.getPrescriptionId())
                .patientId(prescription.getPatient() != null ? prescription.getPatient().getId().toString() : null)
                .doctorId(prescription.getDoctor() != null ? prescription.getDoctor().getId().toString() : null)
                .doctorName(doctorName)
                .diagnosis(prescription.getDiagnosis())
                .symptoms(prescription.getSymptoms())
                .medications(mapMedications(prescription.getMedications()))
                .instructions(prescription.getInstructions())
                .dietToFollow(prescription.getDietToFollow())
                .allergies(prescription.getAllergies())
                .date(prescription.getPrescriptionDate() != null ? prescription.getPrescriptionDate().toString() : null)
                .labReports(labReportRefs)
                .labReportIds(labReportIds)
                .followUp(prescription.getFollowUp())
                .followUpDate(prescription.getFollowUpDate() != null ? prescription.getFollowUpDate().toString() : null)
                .additionalNotes(prescription.getAdditionalNotes())
                .createdAt(prescription.getCreatedAt() != null ? prescription.getCreatedAt().toString() : null)
                .build();
    }

    private List<MedicationDTO> mapMedications(List<Medication> medications) {
        if (medications == null) {
            return new ArrayList<>();
        }

        return medications.stream()
                .map(med -> MedicationDTO.builder()
                        .id(med.getId())
                .drug(med.getDrug())
                        .unit(med.getUnit())
                        .dosage(med.getDosage())
                .duration(med.getDuration())
                        .instructions(med.getInstructions())
                        .timing(med.getTiming())
                        .build())
                .collect(Collectors.toList());
    }

    private List<Long> extractLabReportIds(String labReportsStr) {
        if (labReportsStr == null || labReportsStr.isEmpty()) {
            return new ArrayList<>();
        }

        return Arrays.stream(labReportsStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(idStr -> {
                    try {
                        return Long.parseLong(idStr);
                    } catch (NumberFormatException ex) {
                        log.debug("Skipping non-numeric lab report ID: {}", idStr);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // ==================== FILTER HELPERS ====================

    private boolean filterBySearch(PrescriptionDTO p, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }

        String lowerSearch = search.toLowerCase();
        return (p.getDoctorName() != null && p.getDoctorName().toLowerCase().contains(lowerSearch)) ||
               (p.getInstructions() != null && p.getInstructions().toLowerCase().contains(lowerSearch)) ||
               (p.getDiagnosis() != null && p.getDiagnosis().toLowerCase().contains(lowerSearch));
    }

    private boolean filterByDoctor(PrescriptionDTO p, String doctor) {
        if (doctor == null || doctor.trim().isEmpty()) {
            return true;
        }
        return p.getDoctorName() != null && p.getDoctorName().equalsIgnoreCase(doctor);
    }

    private boolean filterByMonth(PrescriptionDTO p, Integer month) {
        if (month == null) {
            return true;
        }

        try {
            LocalDate date = LocalDate.parse(p.getDate(), dateFormatter);
            return date.getMonthValue() == month;
        } catch (Exception e) {
            log.warn("Could not parse prescription date for month filter: {}", p.getDate());
            return false;
        }
    }

    private boolean filterByYear(PrescriptionDTO p, Integer year) {
        if (year == null) {
            return true;
        }

        try {
            LocalDate date = LocalDate.parse(p.getDate(), dateFormatter);
            return date.getYear() == year;
        } catch (Exception e) {
            log.warn("Could not parse prescription date for year filter: {}", p.getDate());
            return false;
        }
    }
}
