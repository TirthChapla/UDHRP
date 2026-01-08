package com.doctorai.service;

import com.doctorai.dto.MedicationDTO;
import com.doctorai.dto.PrescriptionDTO;

import com.doctorai.model.Medication;
import com.doctorai.model.Patient;
import com.doctorai.model.Prescription;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.repository.PatientRepository;
import com.doctorai.repository.PrescriptionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
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
     * Get all prescriptions for a patient
     */
    public List<PrescriptionDTO> getPatientPrescriptions(String email) {
        log.info("Fetching prescriptions for patient with email: {}", email);
        
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> {
                    log.error("Patient not found with email: {}", email);
                    return new ResourceNotFoundException("Patient not found");
                });
        
        log.debug("Patient found: {} (ID: {})", patient.getUser(), patient.getId());
        
        List<Prescription> prescriptions = prescriptionRepository.findByPatient(patient);
        log.info("Found {} prescriptions for patient ID: {}", prescriptions.size(), patient.getId());
        
        return prescriptions.stream()
                .map(this::mapPrescriptionToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a single prescription by ID
     */
    public PrescriptionDTO getPrescriptionById(Long prescriptionId, String email) {
        log.info("Fetching prescription ID: {} for patient email: {}", prescriptionId, email);
        
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> {
                    log.error("Patient not found with email: {}", email);
                    return new ResourceNotFoundException("Patient not found");
                });
        
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> {
                    log.error("Prescription not found with ID: {}", prescriptionId);
                    return new ResourceNotFoundException("Prescription not found");
                });
        
        // Verify prescription belongs to the patient
        if (!prescription.getPatient().getId().equals(patient.getId())) {
            log.error("Prescription ID: {} does not belong to patient ID: {}", prescriptionId, patient.getId());
            throw new ResourceNotFoundException("Prescription not found");
        }
        
        log.debug("Prescription found and verified for patient");
        return mapPrescriptionToDTO(prescription);
    }

    /**
     * Get unique doctors from prescriptions
     */
    public List<String> getDoctorsFromPrescriptions(String email) {
        log.info("Fetching unique doctors from prescriptions for patient: {}", email);
        
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> {
                    log.error("Patient not found with email: {}", email);
                    return new ResourceNotFoundException("Patient not found");
                });
        
        List<Prescription> prescriptions = prescriptionRepository.findByPatient(patient);
        List<String> doctors = prescriptions.stream()
                .map(Prescription::getDoctor)
                .filter(doctor -> doctor != null && doctor.getUser() != null)
                .map(doctor -> doctor.getUser().getFirstName())
                .filter(name -> name != null && !name.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        
        log.debug("Found {} unique doctors for patient", doctors.size());
        return doctors;
    }

    /**
     * Get years from prescriptions
     */
    public List<Integer> getYearsFromPrescriptions(String email) {
        log.info("Fetching years from prescriptions for patient: {}", email);
        
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> {
                    log.error("Patient not found with email: {}", email);
                    return new ResourceNotFoundException("Patient not found");
                });
        
        List<Prescription> prescriptions = prescriptionRepository.findByPatient(patient);
        List<Integer> years = prescriptions.stream()
                .map(p -> p.getPrescriptionDate().getYear())
                .distinct()
                .sorted((a, b) -> b.compareTo(a)) // Descending order
                .collect(Collectors.toList());
        
        log.debug("Found {} unique years for prescriptions", years.size());
        return years;
    }

    /**
     * Filter prescriptions by multiple criteria
     */
    public List<PrescriptionDTO> filterPrescriptions(String email, String search, String doctor, 
                                                     Integer month, Integer year) {
        log.info("Filtering prescriptions - email: {}, search: {}, doctor: {}, month: {}, year: {}", 
                email, search, doctor, month, year);
        
        List<PrescriptionDTO> allPrescriptions = getPatientPrescriptions(email);
        
        return allPrescriptions.stream()
                .filter(p -> filterBySearch(p, search))
                .filter(p -> filterByDoctor(p, doctor))
                .filter(p -> filterByMonth(p, month))
                .filter(p -> filterByYear(p, year))
                .collect(Collectors.toList());
    }

    // ==================== MAPPING METHODS ====================

    /**
     * Map Prescription entity to PrescriptionDTO
     */
    private PrescriptionDTO mapPrescriptionToDTO(Prescription prescription) {
        log.debug("Mapping prescription ID: {} to DTO", prescription.getId());
        
        return PrescriptionDTO.builder()
                .id(prescription.getId())
                .prescriptionId(prescription.getPrescriptionId())
                .date(prescription.getPrescriptionDate() != null ? prescription.getPrescriptionDate().toString() : null)
                .doctorId(prescription.getDoctor() != null ? prescription.getDoctor().getId().toString() : null)
                .doctorName(prescription.getDoctor() != null && prescription.getDoctor().getUser() != null ? prescription.getDoctor().getUser().getFirstName() : "Unknown")
                .doctorSpecialization(prescription.getDoctor() != null ? prescription.getDoctor().getSpecialization() : null)
                .patientId(prescription.getPatient() != null ? prescription.getPatient().getId().toString() : null)
                .patientName(prescription.getPatient() != null && prescription.getPatient().getUser() != null ? prescription.getPatient().getUser().getFirstName() : "Unknown")
                .diagnosis(prescription.getDiagnosis())
                .symptoms(prescription.getSymptoms())
                .medications(mapMedications(prescription.getMedications()))
                .instructions(prescription.getInstructions())
                .dietToFollow(prescription.getDietToFollow())
                .allergies(prescription.getAllergies())
                .labReports(prescription.getLabReports())
                .followUp(prescription.getFollowUp())
                .followUpDate(prescription.getFollowUpDate() != null ? prescription.getFollowUpDate().toString() : null)
                .additionalNotes(prescription.getAdditionalNotes())
                .createdAt(prescription.getCreatedAt() != null ? prescription.getCreatedAt().toString() : null)
                .build();
    }

    /**
     * Map list of Medication entities to MedicationDTO list
     */
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

    // ==================== FILTER HELPER METHODS ====================

    private boolean filterBySearch(PrescriptionDTO p, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }
        
        String lowerSearch = search.toLowerCase();
        return (p.getDoctorName() != null && p.getDoctorName().toLowerCase().contains(lowerSearch)) ||
               (p.getDiagnosis() != null && p.getDiagnosis().toLowerCase().contains(lowerSearch)) ||
               (p.getPrescriptionId() != null && p.getPrescriptionId().toLowerCase().contains(lowerSearch));
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
            log.warn("Could not parse date for month filter: {}", p.getDate());
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
            log.warn("Could not parse date for year filter: {}", p.getDate());
            return false;
        }
    }
}
