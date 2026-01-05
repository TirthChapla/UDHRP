package com.doctorai.repository;

import com.doctorai.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByUserId(Long userId);
    
    Optional<Patient> findByPatientId(String patientId);
    
    Optional<Patient> findByUserEmail(String email);
    
    @Query("SELECT p FROM Patient p WHERE p.patientId LIKE %:query% OR p.user.firstName LIKE %:query% OR p.user.lastName LIKE %:query% OR p.user.email LIKE %:query% OR p.user.phoneNumber LIKE %:query%")
    List<Patient> searchPatients(@Param("query") String query);
}
