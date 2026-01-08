package com.doctorai.service;

import com.doctorai.dto.*;
import com.doctorai.model.*;
import com.doctorai.repository.*;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DoctorPrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private LabReportRepository labReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Search for a patient by patient ID
     */
    public PatientSearchDTO searchPatientById(String patientId) {
        log.info("Searching for patient with ID: {}", patientId);
        
        Patient patient = patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
        
        return mapToPatientSearchDTO(patient);
    }

    /**
     * Search patients by query (name, email, phone, or patient ID)
     */
    public List<PatientSearchDTO> searchPatients(String query) {
        log.info("Searching patients with query: {}", query);
        
        List<Patient> patients = patientRepository.searchPatients(query);
        
        return patients.stream()
                .map(this::mapToPatientSearchDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get patient's previous prescriptions
     */
    public List<PrescriptionDTO> getPatientPrescriptions(String patientId) {
        log.info("Fetching prescriptions for patient: {}", patientId);
        
        List<Prescription> prescriptions = prescriptionRepository.findByPatientPatientId(patientId);
        
        return prescriptions.stream()
                .map(this::mapToPrescriptionDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get patient's lab reports
     */
    public List<LabReportDTO> getPatientLabReports(String patientId) {
        log.info("Fetching lab reports for patient: {}", patientId);
        
        List<LabReport> labReports = labReportRepository.findByPatientPatientId(patientId);
        
        return labReports.stream()
                .map(this::mapToLabReportDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new prescription
     */
    @Transactional
    public PrescriptionDTO createPrescription(String doctorEmail, CreatePrescriptionRequest request) {
        log.info("Creating prescription for patient: {} by doctor: {}", request.getPatientId(), doctorEmail);
        
        // Find doctor
        User doctorUser = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor user not found"));
        
        Doctor doctor = doctorRepository.findByUserId(doctorUser.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        
        // Find patient
        Patient patient = patientRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + request.getPatientId()));
        
        // Create prescription
        Prescription prescription = new Prescription();
        prescription.setPrescriptionId("RX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setPrescriptionDate(LocalDate.now());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setSymptoms(request.getSymptoms());
        prescription.setInstructions(request.getInstructions());
        prescription.setDietToFollow(request.getDietToFollow());
        prescription.setAllergies(request.getAllergies());
        if (request.getLabReports() != null && !request.getLabReports().isEmpty()) {
            String labReportsCsv = request.getLabReports().stream()
                .filter(r -> r != null && !r.trim().isEmpty())
                .collect(Collectors.joining(","));
            prescription.setLabReports(labReportsCsv);
        }
        prescription.setFollowUp(request.getFollowUp());
        prescription.setAdditionalNotes(request.getAdditionalNotes());
        
        if (request.getFollowUpDate() != null && !request.getFollowUpDate().isEmpty()) {
            prescription.setFollowUpDate(LocalDate.parse(request.getFollowUpDate()));
        }
        
        // Link to appointment if provided
        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElse(null);
            prescription.setAppointment(appointment);
        }
        
        // Save prescription first to get ID
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        
        // Add medications
        if (request.getMedications() != null && !request.getMedications().isEmpty()) {
            for (MedicationDTO medDTO : request.getMedications()) {
                if (medDTO.getDrug() != null && !medDTO.getDrug().trim().isEmpty()) {
                    Medication medication = new Medication();
                    medication.setDrug(medDTO.getDrug());
                    medication.setUnit(medDTO.getUnit());
                    medication.setDosage(medDTO.getDosage());
                    medication.setDuration(medDTO.getDuration());
                    medication.setInstructions(medDTO.getInstructions());
                    medication.setTiming(medDTO.getTiming());
                    savedPrescription.addMedication(medication);
                }
            }
        }
        
        // Save again with medications
        savedPrescription = prescriptionRepository.save(savedPrescription);
        
        log.info("Prescription created successfully with ID: {}", savedPrescription.getPrescriptionId());
        return mapToPrescriptionDTO(savedPrescription);
    }

    /**
     * Get prescription by ID
     */
    public PrescriptionDTO getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + id));
        return mapToPrescriptionDTO(prescription);
    }

    /**
     * Get prescription by prescription ID
     */
    public PrescriptionDTO getPrescriptionByPrescriptionId(String prescriptionId) {
        Prescription prescription = prescriptionRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + prescriptionId));
        return mapToPrescriptionDTO(prescription);
    }

    /**
     * Get all prescriptions created by a doctor
     */
    public List<PrescriptionDTO> getDoctorPrescriptions(String doctorEmail) {
        log.info("Fetching prescriptions for doctor: {}", doctorEmail);
        
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorEmail(doctorEmail);
        
        return prescriptions.stream()
                .map(this::mapToPrescriptionDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get prescription count for a doctor
     */
    public Long getPrescriptionCount(String doctorEmail) {
        return prescriptionRepository.countByDoctorEmail(doctorEmail);
    }

    /**
     * Update a prescription
     */
    @Transactional
    public PrescriptionDTO updatePrescription(Long id, String doctorEmail, CreatePrescriptionRequest request) {
        log.info("Updating prescription ID: {} by doctor: {}", id, doctorEmail);
        
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + id));
        
        // Verify the doctor owns this prescription
        if (!prescription.getDoctor().getUser().getEmail().equals(doctorEmail)) {
            throw new RuntimeException("You are not authorized to update this prescription");
        }
        
        // Update fields
        if (request.getDiagnosis() != null) {
            prescription.setDiagnosis(request.getDiagnosis());
        }
        if (request.getSymptoms() != null) {
            prescription.setSymptoms(request.getSymptoms());
        }
        if (request.getInstructions() != null) {
            prescription.setInstructions(request.getInstructions());
        }
        if (request.getDietToFollow() != null) {
            prescription.setDietToFollow(request.getDietToFollow());
        }
        if (request.getAllergies() != null) {
            prescription.setAllergies(request.getAllergies());
        }
        if (request.getLabReports() != null) {
            String labReportsCsv = request.getLabReports().stream()
                    .filter(r -> r != null && !r.trim().isEmpty())
                    .collect(Collectors.joining(","));
            prescription.setLabReports(labReportsCsv);
        }
        if (request.getFollowUp() != null) {
            prescription.setFollowUp(request.getFollowUp());
        }
        if (request.getAdditionalNotes() != null) {
            prescription.setAdditionalNotes(request.getAdditionalNotes());
        }
        if (request.getFollowUpDate() != null && !request.getFollowUpDate().isEmpty()) {
            prescription.setFollowUpDate(LocalDate.parse(request.getFollowUpDate()));
        }
        
        // Update medications
        if (request.getMedications() != null) {
            // Clear existing medications
            prescription.getMedications().clear();
            
            // Add new medications
            for (MedicationDTO medDTO : request.getMedications()) {
                if (medDTO.getDrug() != null && !medDTO.getDrug().trim().isEmpty()) {
                    Medication medication = new Medication();
                    medication.setDrug(medDTO.getDrug());
                    medication.setUnit(medDTO.getUnit());
                    medication.setDosage(medDTO.getDosage());
                    medication.setDuration(medDTO.getDuration());
                    medication.setInstructions(medDTO.getInstructions());
                    medication.setTiming(medDTO.getTiming());
                    prescription.addMedication(medication);
                }
            }
        }
        
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        log.info("Prescription updated successfully: {}", savedPrescription.getPrescriptionId());
        
        return mapToPrescriptionDTO(savedPrescription);
    }

    /**
     * Delete a prescription
     */
    @Transactional
    public void deletePrescription(Long id, String doctorEmail) {
        log.info("Deleting prescription ID: {} by doctor: {}", id, doctorEmail);
        
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + id));
        
        // Verify the doctor owns this prescription
        if (!prescription.getDoctor().getUser().getEmail().equals(doctorEmail)) {
            throw new RuntimeException("You are not authorized to delete this prescription");
        }
        
        prescriptionRepository.delete(prescription);
        log.info("Prescription deleted successfully");
    }

    // Mapping methods
    private PatientSearchDTO mapToPatientSearchDTO(Patient patient) {
        User user = patient.getUser();
        
        Integer age = null;
        if (user.getDateOfBirth() != null) {
            age = Period.between(user.getDateOfBirth(), LocalDate.now()).getYears();
        }
        
        List<String> chronicConditions = new ArrayList<>();
        if (patient.getChronicDiseases() != null && !patient.getChronicDiseases().isEmpty()) {
            chronicConditions = Arrays.asList(patient.getChronicDiseases().split(","));
        }
        
        String fullAddress = "";
        if (user.getAddress() != null) {
            fullAddress = user.getAddress();
            if (user.getCity() != null) fullAddress += ", " + user.getCity();
            if (user.getState() != null) fullAddress += ", " + user.getState();
            if (user.getZipCode() != null) fullAddress += " " + user.getZipCode();
        }
        
        return PatientSearchDTO.builder()
                .id(patient.getId())
                .patientId(patient.getPatientId())
                .name(user.getFirstName() + " " + user.getLastName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .age(age)
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .bloodGroup(patient.getBloodGroup())
                .phone(user.getPhoneNumber())
                .email(user.getEmail())
                .address(fullAddress)
                .allergies(patient.getAllergies())
                .chronicConditions(chronicConditions)
                .profileImage(user.getProfileImage())
                .build();
    }

    private PrescriptionDTO mapToPrescriptionDTO(Prescription prescription) {
        List<MedicationDTO> medicationDTOs = new ArrayList<>();
        
        if (prescription.getMedications() != null) {
            medicationDTOs = prescription.getMedications().stream()
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
        
        User doctorUser = prescription.getDoctor().getUser();
        User patientUser = prescription.getPatient().getUser();
        
        return PrescriptionDTO.builder()
                .id(prescription.getId())
                .prescriptionId(prescription.getPrescriptionId())
                .date(prescription.getPrescriptionDate().toString())
                .doctorId(prescription.getDoctor().getId().toString())
                .doctorName("Dr. " + doctorUser.getFirstName() + " " + doctorUser.getLastName())
                .doctorSpecialization(prescription.getDoctor().getSpecialization())
                .patientId(prescription.getPatient().getPatientId())
                .patientName(patientUser.getFirstName() + " " + patientUser.getLastName())
                .diagnosis(prescription.getDiagnosis())
                .symptoms(prescription.getSymptoms())
                .medications(medicationDTOs)
                .instructions(prescription.getInstructions())
                .dietToFollow(prescription.getDietToFollow())
                .allergies(prescription.getAllergies())
                .labReports(prescription.getLabReports() != null && !prescription.getLabReports().isEmpty()
                        ? Arrays.stream(prescription.getLabReports().split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .collect(Collectors.toList())
                        : new ArrayList<>())
                .followUp(prescription.getFollowUp())
                .followUpDate(prescription.getFollowUpDate() != null ? prescription.getFollowUpDate().toString() : null)
                .additionalNotes(prescription.getAdditionalNotes())
                .createdAt(prescription.getCreatedAt() != null ? prescription.getCreatedAt().toString() : null)
                .build();
    }

    private LabReportDTO mapToLabReportDTO(LabReport labReport) {
        String doctorName = null;
        String doctorId = null;
        
        if (labReport.getDoctor() != null) {
            User doctorUser = labReport.getDoctor().getUser();
            doctorName = "Dr. " + doctorUser.getFirstName() + " " + doctorUser.getLastName();
            doctorId = labReport.getDoctor().getId().toString();
        }
        
        User patientUser = labReport.getPatient().getUser();
        
        return LabReportDTO.builder()
                .id(labReport.getId())
                .reportId("LAB-" + labReport.getId())
                .date(labReport.getTestDate().toString())
                .testName(labReport.getTestName())
                .status(labReport.getStatus().name())
                .details(labReport.getDoctorNotes())
                .results(labReport.getResults())
                .laboratoryName(labReport.getLaboratoryName())
                .doctorNotes(labReport.getDoctorNotes())
                .patientId(labReport.getPatient().getPatientId())
                .patientName(patientUser.getFirstName() + " " + patientUser.getLastName())
                .doctorId(doctorId)
                .doctorName(doctorName)
                .reportFilePath(labReport.getReportFilePath())
                .build();
    }
}
