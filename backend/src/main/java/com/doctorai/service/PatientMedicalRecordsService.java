package com.doctorai.service;

import com.doctorai.dto.LabReportDTO;
import com.doctorai.dto.MedicationDTO;
import com.doctorai.dto.PrescriptionDTO;

import com.doctorai.model.LabReport;
import com.doctorai.model.Medication;
import com.doctorai.model.Patient;
import com.doctorai.model.Prescription;
import com.doctorai.exception.ResourceNotFoundException;
import com.doctorai.repository.LabReportRepository;
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
import java.util.stream.Collectors;

@Service
@Slf4j
public class PatientMedicalRecordsService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private LabReportRepository labReportRepository;

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

    // ==================== LAB REPORTS ====================

    /**
     * Get all lab reports for a patient
     */
    public List<LabReportDTO> getPatientLabReports(String email) {
        log.info("Fetching lab reports for patient with email: {}", email);

        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> {
                    log.error("Patient not found with email: {}", email);
                    return new ResourceNotFoundException("Patient not found");
                });

        List<LabReport> labReports = labReportRepository.findByPatient(patient);
        log.info("Found {} lab reports for patient ID: {}", labReports.size(), patient.getId());

        return labReports.stream()
                .map(this::mapLabReportToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a single lab report by ID for the logged-in patient
     */
    public LabReportDTO getLabReportById(Long labReportId, String email) {
        log.info("Fetching lab report ID: {} for patient email: {}", labReportId, email);

        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> {
                    log.error("Patient not found with email: {}", email);
                    return new ResourceNotFoundException("Patient not found");
                });

        LabReport labReport = labReportRepository.findById(labReportId)
                .orElseThrow(() -> {
                    log.error("Lab report not found with ID: {}", labReportId);
                    return new ResourceNotFoundException("Lab report not found");
                });

        if (!labReport.getPatient().getId().equals(patient.getId())) {
            log.error("Lab report ID: {} does not belong to patient ID: {}", labReportId, patient.getId());
            throw new ResourceNotFoundException("Lab report not found");
        }

        return mapLabReportToDTO(labReport);
    }

    /**
     * Get unique doctors from lab reports
     */
    public List<String> getDoctorsFromLabReports(String email) {
        log.info("Fetching unique doctors from lab reports for patient: {}", email);

        List<LabReportDTO> labReports = getPatientLabReports(email);

        List<String> doctors = labReports.stream()
                .map(LabReportDTO::getDoctorName)
                .filter(name -> name != null && !name.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        log.debug("Found {} unique doctors for lab reports", doctors.size());
        return doctors;
    }

    /**
     * Get years from lab reports
     */
    public List<Integer> getYearsFromLabReports(String email) {
        log.info("Fetching years from lab reports for patient: {}", email);

        List<LabReportDTO> labReports = getPatientLabReports(email);

        List<Integer> years = labReports.stream()
                .map(LabReportDTO::getDate)
                .filter(date -> date != null && !date.isEmpty())
                .map(date -> {
                    try {
                        return LocalDate.parse(date, dateFormatter).getYear();
                    } catch (Exception e) {
                        log.warn("Could not parse lab report date: {}", date);
                        return null;
                    }
                })
                .filter(year -> year != null)
                .distinct()
                .sorted((a, b) -> b.compareTo(a))
                .collect(Collectors.toList());

        log.debug("Found {} unique years for lab reports", years.size());
        return years;
    }

    /**
     * Filter lab reports by search, doctor, month, year, and status
     */
    public List<LabReportDTO> filterLabReports(String email, String search, String doctor,
                                               Integer month, Integer year, String status) {
        log.info("Filtering lab reports - email: {}, search: {}, doctor: {}, month: {}, year: {}, status: {}",
                email, search, doctor, month, year, status);

        List<LabReportDTO> allReports = getPatientLabReports(email);

        return allReports.stream()
                .filter(r -> filterLabBySearch(r, search))
                .filter(r -> filterLabByDoctor(r, doctor))
                .filter(r -> filterLabByMonth(r, month))
                .filter(r -> filterLabByYear(r, year))
                .filter(r -> filterLabByStatus(r, status))
                .collect(Collectors.toList());
    }

    // ==================== MAPPING METHODS ====================

    /**
     * Map Prescription entity to PrescriptionDTO
     */
    private PrescriptionDTO mapPrescriptionToDTO(Prescription prescription) {
        log.debug("Mapping prescription ID: {} to DTO", prescription.getId());
        
        List<String> labReportsList = new ArrayList<>();
        if (prescription.getLabReports() != null && !prescription.getLabReports().isEmpty()) {
            labReportsList = Arrays.stream(prescription.getLabReports().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }
        
        log.debug("Mapped patient prescription DTO: prescriptionId={}, diagnosis={}, symptoms={}, dietToFollow={}, instructions={}, labReports={}, medicationsCount={}", 
                prescription.getPrescriptionId(),
                prescription.getDiagnosis(),
                prescription.getSymptoms(),
                prescription.getDietToFollow(),
                prescription.getInstructions(),
                labReportsList,
                prescription.getMedications() != null ? prescription.getMedications().size() : 0);
        
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
                .labReports(labReportsList)
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

    private LabReportDTO mapLabReportToDTO(LabReport labReport) {
        log.debug("Mapping lab report ID: {} to DTO", labReport.getId());

        String doctorName = null;
        String doctorSpecialization = null;

        if (labReport.getDoctor() != null && labReport.getDoctor().getUser() != null) {
            doctorName = labReport.getDoctor().getUser().getFirstName();
            doctorSpecialization = labReport.getDoctor().getSpecialization();
        }

        String status = labReport.getStatus() != null ? labReport.getStatus().name().toLowerCase() : null;

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
                .patientName(labReport.getPatient() != null && labReport.getPatient().getUser() != null ? labReport.getPatient().getUser().getFirstName() : null)
                .doctorId(labReport.getDoctor() != null ? labReport.getDoctor().getId().toString() : null)
                .doctorName(doctorName)
                .reportFilePath(labReport.getReportFilePath())
                .build();
    }

    // ==================== LAB REPORT FILTER HELPERS ====================

    private boolean filterLabBySearch(LabReportDTO report, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }

        String lowerSearch = search.toLowerCase();
        return (report.getDoctorName() != null && report.getDoctorName().toLowerCase().contains(lowerSearch)) ||
               (report.getTestName() != null && report.getTestName().toLowerCase().contains(lowerSearch)) ||
               (report.getReportId() != null && report.getReportId().toLowerCase().contains(lowerSearch));
    }

    private boolean filterLabByDoctor(LabReportDTO report, String doctor) {
        if (doctor == null || doctor.trim().isEmpty()) {
            return true;
        }
        return report.getDoctorName() != null && report.getDoctorName().equalsIgnoreCase(doctor);
    }

    private boolean filterLabByMonth(LabReportDTO report, Integer month) {
        if (month == null) {
            return true;
        }

        try {
            LocalDate date = LocalDate.parse(report.getDate(), dateFormatter);
            return date.getMonthValue() == month;
        } catch (Exception e) {
            log.warn("Could not parse date for lab report month filter: {}", report.getDate());
            return false;
        }
    }

    private boolean filterLabByYear(LabReportDTO report, Integer year) {
        if (year == null) {
            return true;
        }

        try {
            LocalDate date = LocalDate.parse(report.getDate(), dateFormatter);
            return date.getYear() == year;
        } catch (Exception e) {
            log.warn("Could not parse date for lab report year filter: {}", report.getDate());
            return false;
        }
    }

    private boolean filterLabByStatus(LabReportDTO report, String status) {
        if (status == null || status.trim().isEmpty() || "all".equalsIgnoreCase(status)) {
            return true;
        }
        return report.getStatus() != null && report.getStatus().equalsIgnoreCase(status);
    }
}
